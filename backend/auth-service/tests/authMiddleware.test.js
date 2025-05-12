const { protect } = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  it("should call next() for valid token", () => {
    jwt.verify.mockReturnValueOnce({ id: "user123", email: "test@example.com" });

    const req = {
      headers: { authorization: "Bearer valid-token" },
    };
    const res = {};
    const next = jest.fn();

    protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: "user123", email: "test@example.com" });
  });

  it("should return 401 for invalid token", () => {
    jwt.verify.mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });

    const req = {
      headers: { authorization: "Bearer invalid-token" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, invalid token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 for missing token", () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, no token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
