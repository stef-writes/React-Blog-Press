const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); 
const Post = require('../models/Posts');
const Tag = require('../models/Tags');
const Category = require('../models/Category');

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

  describe('DELETE /api/posts/:id (Delete Post)', () => {
    let initialTags;
    let initialCategories;

    beforeEach(async () => {
      // Ensure the post created in the outer beforeEach is available as testPostId
      // Create some specific tags and categories for this post, and some shared ones
      await Tag.deleteMany({});
      await Category.deleteMany({});

      initialTags = await Tag.insertMany([
        { name: 'tech' }, 
        { name: 'lifestyle' }, 
        { name: 'unique-to-post' }
      ]);
      initialCategories = await Category.insertMany([
        { name: 'Programming' }, 
        { name: 'Travel' },
        { name: 'unique-category' }
      ]);

      // Update the test post to include these tags and categories
      // We use the testPostId created in the outer beforeEach
      await Post.findByIdAndUpdate(testPostId, {
        tags: [initialTags[0]._id, initialTags[2]._id], // tech, unique-to-post
        categories: [initialCategories[0]._id, initialCategories[2]._id] // Programming, unique-category
      });

      // Optionally, create another post that uses some of the shared tags/categories
      // to ensure they are not deleted
      const anotherPost = new Post({
        title: 'Another Post',
        content: 'Content for another post.',
        author: userAId, // Can be the same author or different
        tags: [initialTags[0]._id], // tech
        categories: [initialCategories[0]._id] // Programming
      });
      await anotherPost.save();
    });

    it('should successfully delete a post by its author and clean up orphaned tags/categories', async () => {
      const response = await request(app)
        .delete(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Post and associated data deleted successfully');

      // Verify post is deleted from DB
      const dbPost = await Post.findById(testPostId);
      expect(dbPost).toBeNull();

      // Verify orphaned tags/categories are deleted, and shared ones remain
      const tagUnique = await Tag.findOne({ name: 'unique-to-post' });
      expect(tagUnique).toBeNull();
      const tagShared = await Tag.findOne({ name: 'tech' });
      expect(tagShared).not.toBeNull();
      
      const categoryUnique = await Category.findOne({ name: 'unique-category' });
      expect(categoryUnique).toBeNull();
      const categoryShared = await Category.findOne({ name: 'Programming' });
      expect(categoryShared).not.toBeNull();

      // We would also test for likes and comments deletion here if we had set them up
      // For now, focusing on post, tags, and categories
    });

    it('should return 403 Forbidden if user is not the author', async () => {
      const initialPost = await Post.findById(testPostId);
      expect(initialPost).not.toBeNull(); // Ensure post exists before attempt

      const response = await request(app)
        .delete(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${userBToken}`); // User B trying to delete User A's post

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized to delete this post');

      // Verify post still exists in DB
      const dbPost = await Post.findById(testPostId);
      expect(dbPost).not.toBeNull();
      expect(dbPost.title).toBe(initialPost.title); // Check if content is unchanged
    });

    // --- More DELETE test cases will go here ---
    // e.g., Attempted Deletion by Non-Author (Forbidden)
    //      Attempted Deletion of a Non-Existent Post (Not Found)

  });

});
