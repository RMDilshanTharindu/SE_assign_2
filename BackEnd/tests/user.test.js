const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let adminToken;
let studentToken;
let victimUserId;

beforeAll(async () => {
  const uniqueId = Date.now();
  const admEmail = `usr_adm_${uniqueId}@campus.com`;
  const stdEmail = `usr_std_${uniqueId}@campus.com`;
  const vicEmail = `usr_vic_${uniqueId}@campus.com`;

  // Admin account
  await request(app).post("/api/auth/register").send({ name: "User Admin", email: admEmail, password: "password123", role: "admin" });
  const admLog = await request(app).post("/api/auth/login").send({ email: admEmail, password: "password123" });
  adminToken = admLog.body.token;

  // Student account
  await request(app).post("/api/auth/register").send({ name: "User Student", email: stdEmail, password: "password123", role: "student" });
  const stdLog = await request(app).post("/api/auth/login").send({ email: stdEmail, password: "password123" });
  studentToken = stdLog.body.token;

  // Target victim user to mutate role or delete
  const vicSetup = await request(app).post("/api/auth/register").send({ name: "Target Victim", email: vicEmail, password: "password123", role: "student" });
  victimUserId = vicSetup.body._id;
});

afterAll(async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection("users").deleteMany({ email: /.*usr_.*/ });
    }
  } catch (err) {
    console.log("User Teardown error:", err);
  } finally {
    await mongoose.connection.close();
  }
});

describe("Admin User Management Dashboard Control Routes", () => {
  
  describe("GET /api/users", () => {
    it("should prevent a common student from scanning database user directory", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${studentToken}`);
      
      expect(res.statusCode).toBe(403);
    });

    it("should allow an executive admin to fetch array of all campus members", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("PATCH /api/users/:id/role", () => {
    it("should allow an admin to upgrade a user to lecturer status", async () => {
      const res = await request(app)
        .patch(`/api/users/${victimUserId}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "lecturer" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should successfully execute database account deletion by admin authorization", async () => {
      const res = await request(app)
        .delete(`/api/users/${victimUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});