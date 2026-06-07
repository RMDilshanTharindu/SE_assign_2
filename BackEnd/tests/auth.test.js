const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Authentication Routes", () => {
  const uniqueId = Date.now();
  const testEmail = `auth_test_${uniqueId}@campus.com`;

  afterAll(async () => {
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.collection("users").deleteMany({ email: /.*auth_test.*/ });
      }
    } catch (error) {
      console.log("Teardown error in auth.test.js:", error);
    } finally {
      await mongoose.connection.close();
    }
  });

  describe("POST /api/auth/register", () => {
    it("should successfully register a new student user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test Auth User",
          email: testEmail,
          password: "password123",
          role: "student"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.email).toBe(testEmail);
    });

    it("should return 400 if user already exists", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test Auth User",
          email: testEmail,
          password: "password123",
          role: "student"
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should log in an existing user and return a token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testEmail,
          password: "password123"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should deny access with incorrect credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testEmail,
          password: "wrong_password"
        });

      expect(res.statusCode).toBe(401);
    });
  });
});