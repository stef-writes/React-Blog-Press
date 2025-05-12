import { useState, useEffect, useCallback } from "react";

// Custom hook to manage blog posts
export function usePosts() {
  // Initialize posts state with data from localStorage, defaulting to an empty array if no data is found
  const [posts, setPosts] = useState(() => {
    const storedPosts = localStorage.getItem("blog_posts");
    return storedPosts ? JSON.parse(storedPosts) : [];
  });
  // Initialize loading state to false, indicating that data is not currently being loaded
  const [isLoading, setIsLoading] = useState(false);
  // Initialize error state to null, indicating that no errors have occurred
  const [error, setError] = useState(null);

  // useEffect hook to load posts from localStorage when the component mounts
  useEffect(() => {
    const storedPosts = localStorage.getItem("blog_posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  // useEffect hook to save posts to localStorage whenever the posts state changes
  useEffect(() => {
    localStorage.setItem("blog_posts", JSON.stringify(posts));
  }, [posts]);

  // useCallback hook to memoize the addPost function, preventing unnecessary re-renders
  const addPost = useCallback((newPost) => {
    // Update the posts state by adding the new post to the beginning of the array
    setPosts((prevPosts) => [
      {
        ...newPost,
        id: Date.now(), // Generate a unique ID for the new post
        createdAt: new Date().toISOString(), // Add a timestamp for when the post was created
        likes: 0, // Initialize likes to 0
        comments: [], // Initialize comments to an empty array
      },
      ...prevPosts,
    ]);
  }, []);

  // useCallback hook to memoize the updatePost function
  const updatePost = useCallback((id, updates) => {
    // Update the posts state by mapping over the array and updating the post with the matching ID
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, ...updates } : post
      )
    );
  }, []);

  // useCallback hook to memoize the deletePost function
  const deletePost = useCallback((id) => {
    // Update the posts state by filtering out the post with the matching ID
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  }, []);

  // useCallback hook to memoize the likePost function
  const likePost = useCallback((id) => {
    // Update the posts state by mapping over the array and incrementing the likes count for the post with the matching ID
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  }, []);

  // useCallback hook to memoize the addComment function
  const addComment = useCallback((postId, comment) => {
    // Update the posts state by mapping over the array and adding the new comment to the post with the matching ID
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(), // Generate a unique ID for the new comment
                  ...comment,
                  createdAt: new Date().toISOString(), // Add a timestamp for when the comment was created
                },
              ],
            }
          : post
      )
    );
  }, []);

  // Return an object containing the posts state, loading state, error state, and the various post manipulation functions
  return {
    posts,
    isLoading,
    error,
    addPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
  };
}
