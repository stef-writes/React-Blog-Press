import { render, fireEvent } from '@testing-library/react';
import { usePosts } from '../usePosts';

// A wrapper component to test the usePosts hook
const TestComponent = () => {
  const {
    posts,
    addPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
  } = usePosts();

  return (
    <div>
      <div data-testid="posts">{JSON.stringify(posts)}</div>
      <button
        data-testid="add-post"
        onClick={() =>
          addPost({
            title: 'Test Post',
            content: 'Test Content',
          })
        }
      >
        Add Post
      </button>
      <button
        data-testid="update-post"
        onClick={() => updatePost(posts[0]?.id, { title: 'Updated Post' })}
      >
        Update Post
      </button>
      <button
        data-testid="delete-post"
        onClick={() => deletePost(posts[0]?.id)}
      >
        Delete Post
      </button>
      <button
        data-testid="like-post"
        onClick={() => likePost(posts[0]?.id)}
      >
        Like Post
      </button>
      <button
        data-testid="add-comment"
        onClick={() =>
          addComment(posts[0]?.id, { content: 'Great post!' })
        }
      >
        Add Comment
      </button>
    </div>
  );
};

describe('usePosts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should add a new post with default properties', () => {
    const { getByTestId } = render(<TestComponent />);
    const addButton = getByTestId('add-post');
    fireEvent.click(addButton);

    const posts = JSON.parse(getByTestId('posts').textContent);
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      title: 'Test Post',
      content: 'Test Content',
      likes: 0,
      comments: [],
    });
  });

  test('should update an existing post', () => {
    const { getByTestId } = render(<TestComponent />);
    const addButton = getByTestId('add-post');
    fireEvent.click(addButton);

    const updateButton = getByTestId('update-post');
    fireEvent.click(updateButton);

    const posts = JSON.parse(getByTestId('posts').textContent);
    expect(posts[0].title).toBe('Updated Post');
  });

  test('should delete a post by id', () => {
    const { getByTestId } = render(<TestComponent />);
    const addButton = getByTestId('add-post');
    fireEvent.click(addButton);

    const deleteButton = getByTestId('delete-post');
    fireEvent.click(deleteButton);

    const posts = JSON.parse(getByTestId('posts').textContent);
    expect(posts).toHaveLength(0);
  });

  test('should increment likes for a post', () => {
    const { getByTestId } = render(<TestComponent />);
    const addButton = getByTestId('add-post');
    fireEvent.click(addButton);

    const likeButton = getByTestId('like-post');
    fireEvent.click(likeButton);

    const posts = JSON.parse(getByTestId('posts').textContent);
    expect(posts[0].likes).toBe(1);
  });

  test('should add a comment to a post', () => {
    const { getByTestId } = render(<TestComponent />);
    const addButton = getByTestId('add-post');
    fireEvent.click(addButton);

    const commentButton = getByTestId('add-comment');
    fireEvent.click(commentButton);

    const posts = JSON.parse(getByTestId('posts').textContent);
    expect(posts[0].comments).toHaveLength(1);
    expect(posts[0].comments[0].content).toBe('Great post!');
  });

  test('should persist posts to localStorage', () => {
    const { getByTestId } = render(<TestComponent />);
    const addButton = getByTestId('add-post');
    fireEvent.click(addButton);

    const posts = JSON.parse(localStorage.getItem('blog_posts'));
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Test Post');
  });

  test('should load posts from localStorage', () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Stored Post',
        content: 'Content',
        likes: 0,
        comments: [],
      },
    ];
    localStorage.setItem('blog_posts', JSON.stringify(mockPosts));

    const { getByTestId } = render(<TestComponent />);
    const posts = JSON.parse(getByTestId('posts').textContent);

    expect(posts).toEqual(mockPosts);
  });

  test('should handle adding a post when localStorage is empty', () => {
    const { getByTestId } = render(<TestComponent />);
    const addButton = getByTestId('add-post');
    fireEvent.click(addButton);

    const posts = JSON.parse(localStorage.getItem('blog_posts'));
    expect(posts).toHaveLength(1);
  });
});
