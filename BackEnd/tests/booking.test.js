const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let studentToken;
let managerToken;
let adminToken;
let targetResourceId;
let testBookingId;

beforeAll(async () => {
  const uniqueId = Date.now();
  
  // 1. Setup Student Account
  const stdEmail = `book_std_${uniqueId}@campus.com`;
  await request(app).post("/api/auth/register").send({ name: "Booking Student", email: stdEmail, password: "password123", role: "student" });
  const stdLog = await request(app).post("/api/auth/login").send({ email: stdEmail, password: "password123" });
  studentToken = stdLog.body.token;

  // 2. Setup Resource Manager Account
  const mgrEmail = `book_mgr_${uniqueId}@campus.com`;
  await request(app).post("/api/auth/register").send({ name: "Booking Manager", email: mgrEmail, password: "password123", role: "resource_manager" });
  const mgrLog = await request(app).post("/api/auth/login").send({ email: mgrEmail, password: "password123" });
  managerToken = mgrLog.body.token;

  // 3. Setup Admin Account
  const admEmail = `book_adm_${uniqueId}@campus.com`;
  await request(app).post("/api/auth/register").send({ name: "Booking Admin", email: admEmail, password: "password123", role: "admin" });
  const admLog = await request(app).post("/api/auth/login").send({ email: admEmail, password: "password123" });
  adminToken = admLog.body.token;

  // 4. Seed an active resource to book against
  const resourceSetup = await request(app)
    .post("/api/resources")
    .set("Authorization", `Bearer ${managerToken}`)
    .send({
      name: `Booking Seminar Hall ${uniqueId}`,
      type: "Room",
      location: "Wimaladharma Building",
      capacity: 150,
      description: "Air-conditioned Presentation Hall",
      status: "available"
    });
  
  targetResourceId = resourceSetup.body._id;
});

afterAll(async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection("users").deleteMany({ email: /.*book_.*/ });
      await mongoose.connection.db.collection("resources").deleteMany({ name: /.*Booking Seminar Hall.*/ });
      await mongoose.connection.db.collection("bookings").deleteMany({});
    }
  } catch (error) {
    console.log("Booking Teardown error:", error);
  } finally {
    await mongoose.connection.close();
  }
});

describe("Booking Operations & Workflow Routes", () => {
  
  describe("POST /api/bookings", () => {
    it("should allow a student to submit a resource booking request", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          resource: targetResourceId,
          bookingDate: "2026-08-20",
          startTime: "08:30",
          endTime: "11:30",
          purpose: "ICT Group Presentation Practice"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.adminStatus).toBe("pending");
      expect(res.body.managerStatus).toBe("pending");
      
      testBookingId = res.body._id;
    });
  });

  describe("GET /api/bookings/my-bookings", () => {
    it("should fetch the student's personal booking list log", async () => {
      const res = await request(app)
        .get("/api/bookings/my-bookings")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("Approval Workflow Endpoints", () => {
    it("should let an admin view pending approvals dashboard", async () => {
      const res = await request(app)
        .get("/api/bookings/admin/pending")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should allow an admin to patch approve a booking request", async () => {
      const res = await request(app)
        .patch(`/api/bookings/${testBookingId}/admin-approve`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.adminStatus).toBe("approved");
    });

    it("should let a resource manager view their pending approvals dashboard", async () => {
      const res = await request(app)
        .get("/api/bookings/manager/pending")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should allow a resource manager to patch reject a booking request", async () => {
      const res = await request(app)
        .patch(`/api/bookings/${testBookingId}/manager-reject`)
        .set("Authorization", `Bearer ${managerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.managerStatus).toBe("rejected");
    });
  });
});