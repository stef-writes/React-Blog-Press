const {
  getComments,
  addComment,
  editComment,
  deleteComment,
} = require('../controllers/commentsController');
const Comment = require('../models/Comments');
const Post = require('../models/Posts');

// Mock models
jest.mock('../models/Comments');
jest.mock('../models/Posts');
jest.mock('../blogLogs/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('Comments Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      params: { id: 'post123', commentId: 'comment123' },
      body: { content: 'Test comment content' },
      user: { id: 'user123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('getComments', () => {
    it('should get all comments for a post', async () => {
      // Mock data
      const mockComments = [
        { _id: 'comment1', content: 'First comment', author: 'user1' },
        { _id: 'comment2', content: 'Second comment', author: 'user2' }
      ];
      
      // Setup mocks
      Comment.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockComments)
        })
      });
      
      // Call function
      await getComments(req, res);
      
      // Assertions
      expect(Comment.find).toHaveBeenCalledWith({ post: 'post123' });
      expect(res.json).toHaveBeenCalledWith(mockComments);
    });
    
    it('should return 500 if there is an error', async () => {
      // Setup mock to throw error
      const error = new Error('Database error');
      Comment.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(error)
        })
      });
      
      // Call function
      await getComments(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to fetch comments',
        error: 'Database error'
      });
    });
  });
  
  describe('addComment', () => {
    it('should add a comment to a post', async () => {
      // Mock data
      const mockPost = {
        _id: 'post123',
        comments: [],
        save: jest.fn().mockResolvedValue(true)
      };
      
      const mockComment = {
        _id: 'comment123',
        content: 'Test comment content',
        author: 'user123',
        post: 'post123',
        save: jest.fn().mockResolvedValue(true)
      };
      
      // Setup mocks
      Post.findById.mockResolvedValue(mockPost);
      Comment.mockImplementation(() => mockComment);
      Comment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockComment)
      });
      
      // Call function
      await addComment(req, res);
      
      // Assertions
      expect(Post.findById).toHaveBeenCalledWith('post123');
      expect(Comment).toHaveBeenCalledWith({
        content: 'Test comment content',
        author: 'user123',
        post: 'post123'
      });
      expect(mockComment.save).toHaveBeenCalled();
      expect(mockPost.comments.push).toHaveBeenCalledWith('comment123');
      expect(mockPost.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });
    
    it('should return 404 if post is not found', async () => {
      // Setup mock to return null
      Post.findById.mockResolvedValue(null);
      
      // Call function
      await addComment(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });
  });
  
  describe('editComment', () => {
    it('should update a comment if user is the author', async () => {
      // Mock data
      const mockComment = {
        _id: 'comment123',
        content: 'Old content',
        author: 'user123', // Same as req.user.id
        save: jest.fn().mockResolvedValue(true)
      };
      
      // Setup mocks
      Comment.findById.mockResolvedValueOnce(mockComment);
      Comment.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue({
          ...mockComment,
          content: 'Test comment content'
        })
      });
      
      // Call function
      await editComment(req, res);
      
      // Assertions
      expect(Comment.findById).toHaveBeenCalledWith('comment123');
      expect(mockComment.content).toBe('Test comment content');
      expect(mockComment.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        ...mockComment,
        content: 'Test comment content'
      });
    });
    
    it('should return 403 if user is not the author', async () => {
      // Mock data with different author
      const mockComment = {
        _id: 'comment123',
        content: 'Old content',
        author: 'differentUser', // Different from req.user.id
        toString: jest.fn().mockReturnValue('differentUser')
      };
      
      // Setup mocks
      Comment.findById.mockResolvedValue(mockComment);
      
      // Call function
      await editComment(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized to edit this comment'
      });
    });
  });
  
  describe('deleteComment', () => {
    it('should delete a comment if user is the author', async () => {
      // Mock data
      const mockComment = {
        _id: 'comment123',
        author: 'user123', // Same as req.user.id
        toString: jest.fn().mockReturnValue('user123'),
        deleteOne: jest.fn().mockResolvedValue(true)
      };
      
      // Setup mocks
      Comment.findById.mockResolvedValue(mockComment);
      
      // Call function
      await deleteComment(req, res);
      
      // Assertions
      expect(Comment.findById).toHaveBeenCalledWith('comment123');
      expect(mockComment.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Comment deleted successfully'
      });
    });
    
    it('should return 403 if user is not the author', async () => {
      // Mock data with different author
      const mockComment = {
        _id: 'comment123',
        author: 'differentUser', // Different from req.user.id
        toString: jest.fn().mockReturnValue('differentUser')
      };
      
      // Setup mocks
      Comment.findById.mockResolvedValue(mockComment);
      
      // Call function
      await deleteComment(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized to delete this comment'
      });
    });
  });
}); 