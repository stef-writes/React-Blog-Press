// Import necessary hooks from React for creating context, using context, managing state with reducer, and side effects
import { createContext, useContext, useReducer, useEffect } from "react";
// Import PropTypes for validating prop types
import PropTypes from "prop-types";

// Create a context for managing blog data
const BlogContext = createContext();

// Define the initial state for the blog context
const initialState = {
  posts: [], // Initially empty array for posts
  categories: [], // Initially empty array for categories
  tags: [], // Initially empty array for tags
  isLoading: false, // Initially not loading
  error: null, // Initially no error
};

// Define the reducer function to handle state updates
function blogReducer(state, action) {
  // Use a switch statement to handle different action types
  switch (action.type) {
    case "SET_LOADING":
      // Update loading state
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      // Update error state and set loading to false
      return { ...state, error: action.payload, isLoading: false };
    case "SET_POSTS":
      // Update posts state and set loading to false
      return { ...state, posts: action.payload, isLoading: false };
    case "SET_CATEGORIES":
      // Update categories state
      return { ...state, categories: action.payload };
    case "SET_TAGS":
      // Update tags state
      return { ...state, tags: action.payload };
    default:
      // Return current state if action type is not recognized
      return state;
  }
}

// Define the BlogProvider component to provide the blog context
export function BlogProvider({ children }) {
  // Use the useReducer hook to manage state and dispatch actions
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Define an asynchronous function to fetch all posts
    const fetchAllPosts = async () => {
      // Dispatch action to set loading to true
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        // Get authentication token from local storage
        const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");
        // Throw error if no token found
        if (!token) throw new Error("Authentication token not found");

        // Get API URL from environment variables
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log(apiUrl);
        // Throw error if API URL is not defined
        if (!apiUrl) throw new Error("API URL is not defined in .env");

        // Initialize variables for pagination
        let allPosts = [];
        let currentPage = 1;
        let totalPages = 1;

        // Fetch posts in batches using pagination
        do {
          const response = await fetch(
            `${apiUrl}/api/posts?page=${currentPage}&results_per_page=5`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include token in authorization header
              },
            }
          );

          // Throw error if response is not ok
          if (!response.ok) throw new Error("Failed to fetch posts");

          const data = await response.json(); // Parse response data as JSON
          totalPages = data.totalPages; // Update totalPages from response

          // Transform fetched posts into desired format
          const transformedPosts = data.posts.map((post) => ({
            id: post._id,
            title: post.title,
            content: post.content,
            tags: post.tags.map((tag) => tag.name), // Extract tag names
            categories: post.categories.map((category) => category.name), // Extract category names
            author: post.author, //author id
            date: new Date(post.createdAt).toLocaleDateString(), // Format date
            likes: post.likes.length, //count likes
            comments: post.comments.length, //count comments
          }));

          // Add transformed posts to allPosts array
          allPosts = [...allPosts, ...transformedPosts];
          // Increment currentPage for next iteration
          currentPage++;
          // Continue loop until currentPage exceeds totalPages
        } while (currentPage <= totalPages);

        // Dispatch action to set posts in state
        dispatch({ type: "SET_POSTS", payload: allPosts });

        // Extract unique categories and tags
        const categories = [
          ...new Set(allPosts.flatMap((post) => post.categories)),
        ];
        const tags = [...new Set(allPosts.flatMap((post) => post.tags))];

        // Dispatch actions to set categories and tags in state
        dispatch({ type: "SET_CATEGORIES", payload: categories });
        dispatch({ type: "SET_TAGS", payload: tags });
      } catch (error) {
        // Dispatch action to set error in state if any error occurs
        dispatch({ type: "SET_ERROR", payload: error.message });
      } finally {
        // Dispatch action to set loading to false in finally block to ensure loading is always set to false after the try...catch block
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    // Call fetchAllPosts function
    fetchAllPosts();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    //renders the children components wrapped with this provider and passes the state and dispatch function from useReducer
    <BlogContext.Provider value={{ state, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
}

// Define propTypes for BlogProvider to ensure children prop is required
BlogProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Define a custom hook to access the blog context
export const useBlog = () => {
  // Use useContext hook to access the BlogContext
  const context = useContext(BlogContext);
  // Throw an error if context is not found (meaning the hook is used outside of a BlogProvider)
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  // Return the context value (state and dispatch)
  return context;
};
