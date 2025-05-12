const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); 
const Post = require('../models/Posts');

let mongoServer;
let mongoUri;

// Define hardcoded valid ObjectId strings for mock users
const mockUserAId = '605e1b8d5183143f68a2ef4a'; // Example valid ObjectId
const mockUserBId = '605e1b8d5183143f68a2ef4b'; // Example valid ObjectId

// Mock the auth middleware
jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'valid-token-userA') {
      // Use the hardcoded ID directly inside the mock
      req.user = { id: '605e1b8d5183143f68a2ef4a', username: 'UserA' };
      return next();
    } else if (token === 'valid-token-userB') {
      // Use the hardcoded ID directly inside the mock
      req.user = { id: '605e1b8d5183143f68a2ef4b', username: 'UserB' };
      return next();
    } else {
      // Simulate unauthorized for other tokens or no token
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
}));

// Mock the logger to prevent logs during tests
jest.mock('../blogLogs/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));


describe('Post Controller - Day 1: Update Functionality', () => {
  // Use the hardcoded IDs defined above for consistency in tests
  let userAId = mockUserAId;
  // let userBId = 'userB_id'; 
  let userAToken = 'valid-token-userA';
  let userBToken = 'valid-token-userB';
  let testPostId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the Post collection before each test and create a sample post
    await Post.deleteMany({});
    const testPost = new Post({
      title: 'Original Title',
      content: 'Original content for the post.',
      author: userAId, // Use the hardcoded ObjectId string
      tags: [], 
      categories: []
    });
    const savedPost = await testPost.save();
    testPostId = savedPost._id.toString();
  });

  afterEach(async () => {
  });

  // --- Test Cases Go Here ---

  describe('PUT /api/posts/:id (Update Post)', () => {

    it('should successfully update a post by its author', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content.',
      };

      const response = await request(app)
        .put(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.post.title).toBe(updateData.title);
      expect(response.body.post.content).toBe(updateData.content);
      expect(response.body.message).toBe('Post updated successfully');

      // Verify in DB
      const dbPost = await Post.findById(testPostId);
      expect(dbPost.title).toBe(updateData.title);
      expect(dbPost.content).toBe(updateData.content);
    });

    it('should return 403 Forbidden if user is not the author', async () => {
      const updateData = {
        title: 'Attempted Update Title',
        content: 'Attempted update content.'
      };

      const response = await request(app)
        .put(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${userBToken}`) // UserB trying to update UserA's post
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized to update this post');
    });

    it('should return 404 Not Found for non-existent post ID', async () => {
      const nonExistentPostId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        title: 'Update for Non-existent Post',
        content: 'Content for non-existent post.'
      };

      const response = await request(app)
        .put(`/api/posts/${nonExistentPostId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });

  
  });

});
