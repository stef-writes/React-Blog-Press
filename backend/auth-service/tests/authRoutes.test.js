const request = require("supertest");
const express = require("express");
const router = require("../routes/authRoutes");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

jest.mock("../models/User");
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(() => ({ id: "user123", email: "test@example.com" })),
  sign: jest.fn(() => "mock-token"),
}));

const app = express();
app.use(express.json());
app.use(router);

describe("Auth Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save.mockResolvedValue();

      const response = await request(app)
        .post("/register")
        .send({ name: "John", email: "john@example.com", password: "password" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
    });
  });

  describe("POST /login", () => {
    it("should log in an existing user", async () => {
      User.findOne.mockResolvedValue({
        matchPassword: jest.fn().mockResolvedValue(true),
        _id: "mock-id",
        name: "John",
        email: "john@example.com",
      });

      const response = await request(app)
        .post("/login")
        .send({ email: "john@example.com", password: "password" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
    });
  });

  describe("POST /logout", () => {
    it("should log out a user", async () => {
      const response = await request(app)
        .post("/logout")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged out successfully");
    });
  });
});
