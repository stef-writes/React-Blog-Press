const mongoose = require("mongoose");
const Category = require("../models/Category");
const Post = require("../models/Posts");
const {
  getCategories,
  getCategoryById,
  addCategoryToPost,
  deleteCategoryById,
} = require("../controllers/categoryController");

jest.mock("../models/Category");
jest.mock("../models/Posts");

describe("Category Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [{ name: "Tech" }, { name: "Health" }];
      Category.find.mockResolvedValue(mockCategories);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getCategories(req, res);

      expect(Category.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    it("should return 500 if an error occurs", async () => {
      Category.find.mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getCategories(req, res);

      expect(Category.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch categories",
        error: "Database error",
      });
    });
  });

  describe("getCategoryById", () => {
    it("should return the specified category", async () => {
      const mockCategory = { _id: "123", name: "Tech" };
      Category.findById.mockResolvedValue(mockCategory);

      const req = { params: { id: "123" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getCategoryById(req, res);

      expect(Category.findById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith(mockCategory);
    });

    it("should return 404 if category is not found", async () => {
      Category.findById.mockResolvedValue(null);

      const req = { params: { id: "123" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Category not found" });
    });

    it("should return 500 if an error occurs", async () => {
      Category.findById.mockRejectedValue(new Error("Database error"));

      const req = { params: { id: "123" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch category",
        error: "Database error",
      });
    });
  });

  describe("addCategoryToPost", () => {
    it("should add a category to the specified post", async () => {
      const mockPost = { _id: "456", categories: [], save: jest.fn() };
      const mockCategory = { _id: "123", save: jest.fn() };

      Post.findById.mockResolvedValue(mockPost);
      Category.findOne.mockResolvedValue(null);
      Category.mockImplementation(() => mockCategory);

      const req = {
        params: { id: "456" },
        body: { categoryName: "Tech" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await addCategoryToPost(req, res);

      expect(Post.findById).toHaveBeenCalledWith("456");
      expect(Category.findOne).toHaveBeenCalledWith({ name: "Tech" });
      expect(mockCategory.save).toHaveBeenCalled();
      expect(mockPost.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Category added to post successfully",
        post: mockPost,
      });
    });

    it("should return 404 if post is not found", async () => {
      Post.findById.mockResolvedValue(null);

      const req = { params: { id: "456" }, body: { categoryName: "Tech" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await addCategoryToPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
    });
  });

  describe("deleteCategoryById", () => {
    it("should delete the specified category", async () => {
      const mockCategory = { _id: "123", deleteOne: jest.fn() };
      const mockPosts = [{ _id: "456" }];

      Category.findById.mockResolvedValue(mockCategory);
      Post.find.mockResolvedValue(mockPosts);

      const req = { params: { id: "123" }, user: { id: "789" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await deleteCategoryById(req, res);

      expect(Category.findById).toHaveBeenCalledWith("123");
      expect(Post.find).toHaveBeenCalledWith({
        categories: mockCategory._id,
        author: req.user.id,
      });
      expect(mockCategory.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Category deleted successfully",
      });
    });

    it("should return 403 if user is not authorized", async () => {
      const mockCategory = { _id: "123" };
      const mockPosts = [];

      Category.findById.mockResolvedValue(mockCategory);
      Post.find.mockResolvedValue(mockPosts);

      const req = { params: { id: "123" }, user: { id: "789" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await deleteCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "You are not authorized to delete this category",
      });
    });

    it("should return 404 if category is not found", async () => {
      Category.findById.mockResolvedValue(null);

      const req = { params: { id: "123" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await deleteCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Category not found" });
    });
  });
});
