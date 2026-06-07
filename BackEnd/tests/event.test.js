const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let adminToken;
let studentToken;
let testEventId;

beforeAll(async () => {
  const uniqueId = Date.now();
  const admEmail = `evt_adm_${uniqueId}@campus.com`;
  const stdEmail = `evt_std_${uniqueId}@campus.com`;

  // Admin login
  await request(app).post("/api/auth/register").send({ name: "Event Admin", email: admEmail, password: "password123", role: "admin" });
  const admLog = await request(app).post("/api/auth/login").send({ email: admEmail, password: "password123" });
  adminToken = admLog.body.token;

  // Student login
  await request(app).post("/api/auth/register").send({ name: "Event Student", email: stdEmail, password: "password123", role: "student" });
  const stdLog = await request(app).post("/api/auth/login").send({ email: stdEmail, password: "password123" });
  studentToken = stdLog.body.token;
});

afterAll(async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection("users").deleteMany({ email: /.*evt_.*/ });
      await mongoose.connection.db.collection("events").deleteMany({ title: /.*Test Hackathon.*/ });
    }
  } catch (err) {
    console.log("Event Teardown error:", err);
  } finally {
    await mongoose.connection.close();
  }
});

describe("Campus Event Scheduling Routes", () => {
  
  describe("POST /api/events", () => {
    it("should refuse to let a regular student create an event notice", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ title: "Illegal Event", description: "Breach", eventDate: "2026-09-01", startTime: "09:00", endTime: "17:00", organizer: "Student Council", resources: [] });
      
      expect(res.statusCode).toBe(403);
    });

    it("should permit an administrator to post a campus wide event scheduled notice", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: `Test Hackathon ${Date.now()}`,
          description: "Annual 24-hour rapid coding innovation competition",
          eventDate: "2026-11-05",
          startTime: "08:00",
          endTime: "18:00",
          organizer: "Faculty of Computing",
          resources: [] 
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      testEventId = res.body._id;
    });
  });

  describe("GET /api/events", () => {
    it("should allow any public/unauthenticated request to fetch the events catalogue", async () => {
      const res = await request(app).get("/api/events");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("PUT /api/events/:id", () => {
    it("should allow administrators to alter scheduled event metadata", async () => {
      const res = await request(app)
        .put(`/api/events/${testEventId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Updated Test Hackathon",
          description: "Revised timelines and prize pools",
          eventDate: "2026-11-06",
          startTime: "09:00",
          endTime: "21:00",
          organizer: "Faculty of Computing",
          resources: []
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Test Hackathon");
    });
  });
});