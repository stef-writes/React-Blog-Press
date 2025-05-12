const request = require("supertest");
const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = require("../routes/gatewayRoutes");

jest.mock("axios");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(router);


describe("Router Tests", () => {
  describe("POST /auth/register", () => {
    it("should forward the request to Auth Service and return a successful response", async () => {
      axios.post.mockResolvedValueOnce({
        status: 201,
        data: { message: "User registered successfully" },
      });

      const response = await request(app)
        .post("/auth/register")
        .send({ username: "test", password: "test123" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "User registered successfully" });
    });

    it("should handle errors from the Auth Service", async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: "Bad Request" },
        },
      });

      const response = await request(app)
        .post("/auth/register")
        .send({ username: "test" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Bad Request" });
    });

    it("should handle network errors", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      const response = await request(app)
        .post("/auth/register")
        .send({ username: "test", password: "test123" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Internal Server Error",
        error: "Network Error",
      });
    });
  });

  describe("POST /auth/login", () => {
    it("should forward the login request and return success", async () => {
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { token: "mock-token" },
      });

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "test", password: "test123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: "mock-token" });
    });
  });

  describe("POST /auth/logout", () => {
    it("should forward the logout request with valid authorization header", async () => {
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { message: "Logged out successfully" },
      });

      const response = await request(app)
        .post("/auth/logout")
        .set("Authorization", "Bearer mock-token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Logged out successfully" });
    });

    it("should return 401 if authorization header is missing", async () => {
      const response = await request(app).post("/auth/logout");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Not authorized, no token" });
    });
  });

  describe("Protect Middleware", () => {
    it("should allow access with a valid token", async () => {
      jwt.verify.mockReturnValueOnce({ id: "user123" });

      const middleware = require("../middleware/authMiddleware").protect;
      const req = {
        headers: { authorization: "Bearer valid-token" },
      };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual({ id: "user123" });
    });

    it("should return 401 for invalid token", () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error("Invalid token");
      });

      const middleware = require("../middleware/authMiddleware").protect;
      const req = {
        headers: { authorization: "Bearer invalid-token" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized, invalid token",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
