const { register, login, logout } = require("../controllers/authController");
const User = require("../models/User");
const { generateToken } = require("../utils/tokenUtils");

jest.mock("../models/User");
jest.mock("../utils/tokenUtils");

describe("Auth Controller", () => {
  describe("register", () => {
    it("should register a new user", async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn();
      generateToken.mockReturnValue("mock-token");

      const req = {
        body: { name: "John", email: "john@example.com", password: "password" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: { id: undefined, name: "John", email: "john@example.com" },
        token: "mock-token",
      });
    });
  });

  describe("login", () => {
    it("should log in an existing user", async () => {
      User.findOne.mockResolvedValue({
        matchPassword: jest.fn().mockResolvedValue(true),
        _id: "mock-id",
        name: "John",
        email: "john@example.com",
      });
      generateToken.mockReturnValue("mock-token");

      const req = {
        body: { email: "john@example.com", password: "password" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: { id: "mock-id", name: "John", email: "john@example.com" },
        token: "mock-token",
      });
    });
  });

  describe("logout", () => {
    it("should log out a user", () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      logout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
    });
  });
});
