const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let managerToken;
let studentToken;
let createdResourceId;

beforeAll(async () => {
  const uniqueId = Date.now();
  const managerEmail = `res_mgr_${uniqueId}@campus.com`;
  const studentEmail = `res_std_${uniqueId}@campus.com`;

  // Register and login manager
  await request(app).post("/api/auth/register").send({
    name: "Resource Mgr", email: managerEmail, password: "password123", role: "resource_manager"
  });
  const mgrLogin = await request(app).post("/api/auth/login").send({ email: managerEmail, password: "password123" });
  managerToken = mgrLogin.body.token;

  // Register and login student
  await request(app).post("/api/auth/register").send({
    name: "Resource Student", email: studentEmail, password: "password123", role: "student"
  });
  const stdLogin = await request(app).post("/api/auth/login").send({ email: studentEmail, password: "password123" });
  studentToken = stdLogin.body.token;
});

afterAll(async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection("users").deleteMany({ email: /.*res_mgr.*|.*res_std.*/ });
      await mongoose.connection.db.collection("resources").deleteMany({ name: /.*Test Spec.*/ });
    }
  } catch (err) {
    console.log("Teardown error:", err);
  } finally {
    await mongoose.connection.close();
  }
});

describe("Resource Management Routes", () => {
  
  describe("POST /api/resources", () => {
    it("should block a student from creating resources", async () => {
      const res = await request(app)
        .post("/api/resources")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ name: "Student Denied Room", type: "Room", location: "Block E", capacity: 30, description: "No entry", status: "available" });
      
      expect(res.statusCode).toBe(403);
    });

    it("should allow a manager to successfully create a resource with all required schema fields", async () => {
      const res = await request(app)
        .post("/api/resources")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          name: `Test Spec Lab ${Date.now()}`,
          type: "Hardware",
          location: "Building 02 - Floor 1",
          capacity: 50,
          description: "High performance development workstations",
          status: "available"
        });

      if(res.statusCode === 500) console.log("Debug payload schema matching error:", res.body);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      createdResourceId = res.body._id; // Store ID for subsequent GET/PUT/DELETE checks
    });
  });

  describe("GET /api/resources", () => {
    it("should allow a student to view the array of resources", async () => {
      const res = await request(app)
        .get("/api/resources")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should allow getting a specific resource details by ID", async () => {
      const res = await request(app)
        .get(`/api/resources/${createdResourceId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(createdResourceId);
    });
  });

  describe("PATCH /api/resources/:id/status", () => {
    it("should allow a resource manager to flag a resource for maintenance", async () => {
      const res = await request(app)
        .patch(`/api/resources/${createdResourceId}/status`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({ status: "maintenance" });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("maintenance");
    });
  });
});