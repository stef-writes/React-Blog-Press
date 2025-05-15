const {
  addLike,
  removeLike,
  getLikesByPost
} = require('../controllers/likeController');
const Like = require('../models/Like');
const Post = require('../models/Posts');

// Mock models
jest.mock('../models/Like');
jest.mock('../models/Posts');
jest.mock('../blogLogs/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('Like Controller', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { id: 'post123' },
      user: { id: 'user123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  it('should add a like to a post', async () => {
    // Mocks
    const mockPost = {
      _id: 'post123',
      likes: { push: jest.fn() },
      save: jest.fn().mockResolvedValue(true)
    };
    const mockLike = {
      _id: 'like123',
      save: jest.fn().mockResolvedValue(true)
    };
    
    Post.findById.mockResolvedValue(mockPost);
    Like.findOne.mockResolvedValue(null);
    Like.mockImplementation(() => mockLike);
    
    // Test
    await addLike(req, res);
    
    // Assert
    expect(mockPost.likes.push).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
  
  it('should remove a like from a post', async () => {
    // Mocks
    const mockLike = {
      _id: 'like123',
      user: 'user123',
      deleteOne: jest.fn().mockResolvedValue(true)
    };
    mockLike.user.toString = jest.fn().mockReturnValue('user123');
    
    const mockPost = {
      likes: ['like123'],
      save: jest.fn().mockResolvedValue(true)
    };
    
    Like.findOne.mockResolvedValue(mockLike);
    Post.findById.mockResolvedValue(mockPost);
    
    // Test
    await removeLike(req, res);
    
    // Assert
    expect(mockLike.deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Like removed successfully' });
  });
  
  it('should get all likes for a post', async () => {
    // Mocks
    const mockLikes = [{ _id: 'like1' }, { _id: 'like2' }];
    Like.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockLikes)
    });
    
    // Test
    await getLikesByPost(req, res);
    
    // Assert
    expect(Like.find).toHaveBeenCalledWith({ post: 'post123' });
    expect(res.json).toHaveBeenCalledWith(mockLikes);
  });
}); 