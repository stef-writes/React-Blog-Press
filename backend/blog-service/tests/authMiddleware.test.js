const { protect, optionalAuth } = require("../middleware/authMiddleware");
const { verifyToken, decodeToken } = require("../utils/jwtUtil");
const logger = require("../blogLogs/logger");

jest.mock("../utils/jwtUtil");
jest.mock("../blogLogs/logger");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("protect middleware", () => {
    it("should call next() for valid token", () => {
      const mockToken = "valid-token";
      req.headers.authorization = `Bearer ${mockToken}`;
      verifyToken.mockReturnValue({ id: "user123", email: "test@example.com" });

      protect(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith(mockToken);
      expect(req.user).toEqual({ id: "user123", email: "test@example.com" });
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });      
      

    it("should return 401 for invalid token", () => {
      const mockToken = "invalid-token";
      req.headers.authorization = `Bearer ${mockToken}`;
      const error = new Error("Invalid token");
      error.name = "JsonWebTokenError"; // Set the error name to match middleware checks
      verifyToken.mockImplementation(() => {
        throw error;
      });

      protect(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, invalid token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 for expired token", () => {
      const mockToken = "expired-token";
      req.headers.authorization = `Bearer ${mockToken}`;
      const error = new Error("Token expired");
      error.name = "TokenExpiredError"; // Set the error name to match middleware checks
      verifyToken.mockImplementation(() => {
        throw error;
      });

      protect(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Token expired, please log in again" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 for unexpected errors", () => {
      const mockToken = "valid-token";
      req.headers.authorization = `Bearer ${mockToken}`;
      verifyToken.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      protect(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("optionalAuth middleware", () => {
    it("should call next() without token", () => {
      optionalAuth(req, res, next);

      expect(decodeToken).not.toHaveBeenCalled();
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it("should attach user for valid token", () => {
      const mockToken = "valid-token";
      req.headers.authorization = `Bearer ${mockToken}`;
      decodeToken.mockReturnValue({ id: "user123", email: "test@example.com" });

      optionalAuth(req, res, next);

      expect(decodeToken).toHaveBeenCalledWith(mockToken);
      expect(req.user).toEqual({ id: "user123", email: "test@example.com" });
      expect(next).toHaveBeenCalled();
    });

    it("should call next() for invalid token without failing", () => {
      const mockToken = "invalid-token";
      req.headers.authorization = `Bearer ${mockToken}`;
      decodeToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      optionalAuth(req, res, next);

      expect(decodeToken).toHaveBeenCalledWith(mockToken);
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });
});
