// Import necessary hooks from React library
import { useState, useEffect } from "react";
// Import useLocation and useNavigate hooks from react-router-dom for working with URL and navigation
import { useLocation, useNavigate } from "react-router-dom";
// Import the BlogList component to display the list of blog posts
import BlogList from "../components/BlogList/BlogList";
// Import CSS styles for the component
import styles from "./Home.module.css";

// Define the Bloglist functional component
function Bloglist() {
  // Initialize state variables using useState hook
  const [posts, setPosts] = useState([]); // Stores all fetched posts
  const [filteredPosts, setFilteredPosts] = useState([]); // Stores posts filtered based on criteria
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Stores any errors during fetching

  // Initialize state for dark mode based on localStorage value
  const [isDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Get location object (contains information about current URL)
  const location = useLocation();
  // allows accessing query parameters, pathname, etc.
  // Get navigation function to programmatically change the route
  const navigate = useNavigate();
  // allows redirecting to different pages

  // Asynchronous function to fetch all posts with pagination
  const fetchAllPosts = async () => {
    setIsLoading(true); // Set isLoading to true before fetching
    setError(null); // Clear any previous errors

    try {
      const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}"); // Retrieve auth token from localStorage
      if (!token) throw new Error("Authentication token not found"); // Throw error if token is missing

      const apiUrl = import.meta.env.VITE_API_URL; // Get API URL from environment variables
      if (!apiUrl) throw new Error("API URL is not defined in .env"); // Throw error if API URL is not defined

      let allPosts = []; // Initialize an empty array to store all posts
      let currentPage = 1; // Initialize current page to 1
      let totalPages = 1; // Initialize total pages to 1

      // Fetch posts until all pages are retrieved
      do {
        const response = await fetch(
          `${apiUrl}/api/posts?page=${currentPage}&results_per_page=5`, // Construct API URL with pagination parameters
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include authorization token in headers
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch posts"); // Throw error if response is not ok

        const data = await response.json(); // Parse response data as JSON
        totalPages = data.totalPages; // Update totalPages from response data

        // Transform each post object to include desired fields
        const transformedPosts = data.posts.map((post) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          tags: post.tags.map((tag) => tag.name), // Extract tag names
          categories: post.categories.map((category) => category.name), // Extract category names
          author: post.author,
          date: new Date(post.createdAt).toLocaleDateString(), // Format date string
          likes: post.likes.length,
          comments: post.comments.length,
        }));

        allPosts = [...allPosts, ...transformedPosts]; // Add transformed posts to allPosts array
        currentPage++; // Increment currentPage for next iteration
      } while (currentPage <= totalPages); // Continue loop until currentPage exceeds totalPages

      setPosts(allPosts); // Update posts state with fetched posts
    } catch (err) {
      setError(err.message); // Set error state if any error occurs
    } finally {
      setIsLoading(false); // Set isLoading to false after fetching completes
    }
  };

  // useEffect hook to fetch posts when the component mounts for the first time.  Empty dependency array ensures this
  useEffect(() => {
    fetchAllPosts();
  }, []);

  // useEffect hook to filter posts based on query parameters in the URL
  useEffect(() => {
    // Extract query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    // URLSearchParams is a built in object for working with query strings

    const filters = {
      category: queryParams.get("category") || "", //gets the value associated with the "category" key, or an empty string if not found
      author: queryParams.get("author") || "",
      tag: queryParams.get("tag") || "",
      search: queryParams.get("search") || "",
    };

    // Filter posts based on extracted filters
    const filtered = posts.filter((post) => {
      // Check if post matches category filter (case-insensitive) if filter is applied
      const matchesCategory = filters.category
        ? post.categories
            .map((category) => category.toLowerCase())
            .includes(filters.category.toLowerCase())
        : true; // Match all if no category filter

      // Check if post matches author filter if filter is applied
      const matchesAuthor = filters.author
        ? post.author === filters.author
        : true; // Match all if no author filter

      const matchesTag = filters.tag ? post.tags.includes(filters.tag) : true; //Match all if no tag filter

      // Check if post title or content matches search filter (case-insensitive) if filter is applied
      const matchesSearch = filters.search
        ? post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.content.toLowerCase().includes(filters.search.toLowerCase())
        : true; // Match all if no search filter

      return matchesCategory && matchesAuthor && matchesTag && matchesSearch; // Return true if post matches all filters
    });

    setFilteredPosts(filtered); // Update filteredPosts state with filtered results
  }, [location.search, posts]); // this useEffect runs when location.search changes (meaning query parameters have changed) or when the `posts` array changes

  // Function to handle filter changes and update the URL
  const handleFilterChange = (updatedFilters) => {
    const queryParams = new URLSearchParams(location.search); // Get current query parameters

    // Update query parameters based on filter changes
    Object.entries(updatedFilters).forEach(([key, value]) => {
      // If a filter value is provided, set it in query parameters, otherwise delete the corresponding parameter
      if (value) {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    });

    // Navigate to the updated URL with new query parameters
    navigate(`?${queryParams.toString()}`);
  };

  return (
    <div className={styles.home}>
      <main className={styles.mainContent}>
        {/* Conditionally render loading message, error message, or BlogList component */}
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <BlogList
            filteredPosts={filteredPosts} // Pass filtered posts to BlogList
            isDarkMode={isDarkMode} // Pass isDarkMode to BlogList for styling
            onFilterChange={handleFilterChange} // Pass handleFilterChange function to BlogList for filter updates
          />
        )}
      </main>
    </div>
  );
}

export default Bloglist;
