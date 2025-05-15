const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Our Express app
const Post = require('../models/Posts');
const Comment = require('../models/Comments');
const User = require('../models/User'); // We created this for schema reference

let mongoServer;
let mongoUri;

// --- Mocking --- //

// Define hardcoded valid ObjectId strings for mock users
const mockUserOneId = '605e1b8d5183143f68a2ef4c'; // Example valid ObjectId for User One
const mockUserTwoId = '605e1b8d5183143f68a2ef4d'; // Example valid ObjectId for User Two

// Mock the auth middleware (consistent with post.test.js)
jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'valid-token-userOne') {
      req.user = { id: mockUserOneId, email: 'userone@example.com' }; // Add email if needed by app logic
      return next();
    } else if (token === 'valid-token-userTwo') {
      req.user = { id: mockUserTwoId, email: 'usertwo@example.com' };
      return next();
    } else {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
}));

// Mock the logger
jest.mock('../blogLogs/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// --- Test Suite --- //

describe('Comment API Endpoints', () => {
  let userOneToken = 'valid-token-userOne';
  // let userTwoToken = 'valid-token-userTwo'; // If needed for testing other users' interactions
  let testPost;
  let testComment; // Will hold a comment created during tests

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri); // Removed deprecated options
    }
    // It's good practice to also ensure User model is registered if not already
    // This is often implicitly handled by requiring it, but explicit can be safer in complex setups.
    // However, our User model file already does `mongoose.models.User || mongoose.model(...)`
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await Post.deleteMany({});
    await Comment.deleteMany({});
    // We don't create User documents here as our auth is mocked with hardcoded IDs
    // and the User model in blog-service is for schema reference for Mongoose .populate()

    // Create a sample post by User One for testing comments
    const postData = {
      title: 'Test Post for Comments',
      content: 'This post will have comments.',
      author: mockUserOneId,
      tags: [], // Add mock tag IDs if your Post model/validation requires them
      categories: [], // Add mock category IDs if your Post model/validation requires them
    };
    testPost = await new Post(postData).save();
  });

  // Test cases for comment functionality will go here
  // e.g., Adding a comment, getting comments, updating, deleting

  // Example placeholder for a test case (we will fill these in)
  describe('POST /api/posts/:postId/comments', () => {
    it('should allow an authenticated user to add a comment to a post', async () => {
      const commentData = { content: 'This is a test comment!' };

      const response = await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .send(commentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.content).toBe(commentData.content);
      expect(response.body.author._id).toBe(mockUserOneId);
      expect(response.body.post).toBe(testPost._id.toString());

      // Verify in DB
      const dbComment = await Comment.findById(response.body._id);
      expect(dbComment).not.toBeNull();
      expect(dbComment.content).toBe(commentData.content);

      const updatedPost = await Post.findById(testPost._id);
      expect(updatedPost.comments).toContain(dbComment._id);
      
      // Store the created comment for potential use in other tests
      testComment = response.body; 
    });

    it('should return 401 if user is not authenticated', async () => {
      const commentData = { content: 'Attempting comment without auth' };
      const response = await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .send(commentData);
      
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/posts/:postId/comments', () => {
    it('should allow an authenticated user to retrieve comments for a post', async () => {
      // First, add a comment to ensure there is something to retrieve
      const commentData = { content: 'Comment 1 for retrieval' };
      await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .send(commentData);

      const response = await request(app)
        .get(`/api/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].content).toBe(commentData.content);
      expect(response.body[0].author._id).toBe(mockUserOneId);
    });

    it('should return an empty array if a post has no comments', async () => {
        // Create a new post that will have no comments
        const postWithoutComments = await new Post({
            title: 'Post Without Comments',
            content: 'This post has no comments yet.',
            author: mockUserOneId,
        }).save();

        const response = await request(app)
            .get(`/api/posts/${postWithoutComments._id}/comments`)
            .set('Authorization', `Bearer ${userOneToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/comments/:commentId', () => {
    it('should retrieve a specific comment by its ID', async () => {
      // Ensure testComment is created from the POST test or create one directly here
      if (!testComment || !testComment._id) {
        const commentData = { content: 'Comment for single GET' };
        const addResponse = await request(app)
          .post(`/api/posts/${testPost._id}/comments`)
          .set('Authorization', `Bearer ${userOneToken}`)
          .send(commentData);
        testComment = addResponse.body;
      }

      const response = await request(app)
        .get(`/api/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(testComment._id);
      expect(response.body.content).toBe(testComment.content);
      expect(response.body.author._id).toBe(mockUserOneId);
    });

    it('should return 404 for a non-existent comment ID', async () => {
      const nonExistentCommentId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .get(`/api/comments/${nonExistentCommentId}`)
        .set('Authorization', `Bearer ${userOneToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/comments/:commentId', () => {
    beforeEach(async () => {
      // Ensure a comment by userOne exists before each update test
      const commentData = { content: 'Original comment for update tests' };
      const addResponse = await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .send(commentData);
      testComment = addResponse.body;
    });

    it('should allow the author to update their comment', async () => {
      const updatedContent = { content: 'This comment has been updated.' };
      const response = await request(app)
        .put(`/api/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .send(updatedContent);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe(updatedContent.content);
      expect(response.body.author._id).toBe(mockUserOneId);

      const dbComment = await Comment.findById(testComment._id);
      expect(dbComment.content).toBe(updatedContent.content);
    });

    it('should return 403 if a user tries to update another user\'s comment', async () => {
      const updatedContent = { content: 'Attempt to update others comment' };
      const response = await request(app)
        .put(`/api/comments/${testComment._id}`)
        .set('Authorization', 'Bearer valid-token-userTwo') // User Two's token
        .send(updatedContent);
      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/comments/:commentId', () => {
    beforeEach(async () => {
      // Ensure a comment by userOne exists before each delete test
      const commentData = { content: 'Comment to be deleted' };
      const addResponse = await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .send(commentData);
      testComment = addResponse.body;
    });

    it('should allow the author to delete their comment', async () => {
      const response = await request(app)
        .delete(`/api/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Comment deleted successfully');

      const dbComment = await Comment.findById(testComment._id);
      expect(dbComment).toBeNull();
      
      const updatedPost = await Post.findById(testPost._id);
      expect(updatedPost.comments).not.toContain(testComment._id);
    });

    it('should return 403 if a user tries to delete another user\'s comment', async () => {
      const response = await request(app)
        .delete(`/api/comments/${testComment._id}`)
        .set('Authorization', 'Bearer valid-token-userTwo'); // User Two's token
      expect(response.status).toBe(403);

      const dbComment = await Comment.findById(testComment._id);
      expect(dbComment).not.toBeNull(); // Comment should still exist
    });
  });

});
