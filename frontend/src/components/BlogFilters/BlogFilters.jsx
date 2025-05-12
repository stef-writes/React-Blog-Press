// Import necessary hooks and components.
import { memo, useEffect, useState } from "react"; // Import React hooks for functional component logic
import PropTypes from "prop-types"; // Import PropTypes for component prop type checking
import styles from "./BlogFilters.module.css"; // Import CSS module for styling
import BlogSearch from "../BlogSearch/BlogSearch"; // Import the BlogSearch component

// Memoize the BlogFilters component to optimize performance. Prevents unnecessary re-renders if props haven't changed, using memo
const BlogFilters = memo(function BlogFilters({
  filters, // Current filter values
  onFilterChange, // Function to handle filter changes
  searchTerm, // Current search term
  onSearch, // Function to handle search
  resultCount, // Number of search results
}) {
  // Initialize state variables using useState hook
  const [dynamicAuthors, setAuthors] = useState([]); // State for authors fetched dynamically
  const [categories, setCategories] = useState([]); // State for categories
  const [allTags, setTags] = useState([]); // State for tags

  // Define an asynchronous function to fetch filter data (authors, categories, tags) from the API.
  const fetchFiltersData = async () => {
    try {
      // Retrieve the authentication token from local storage.  JSON.parse is used to parse the JSON string
      const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");

      // If no token is found, alert the user and return.  This check ensures that the user is logged in before making requests to the API
      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      // Get the API URL from environment variables. import.meta.env.VITE_API_URL accesses environment variables prefixed with VITE_ during development
      const apiUrl = import.meta.env.VITE_API_URL;
      // Throw an error if the API URL is not defined - this is a safety check
      if (!apiUrl) throw new Error("API URL is not defined in .env");

      // Initialize variables for pagination.  We are going to fetch the posts in batches
      let allPosts = []; // Array to store all fetched posts
      let currentPage = 1; // Current page number for fetching posts
      let totalPages = 1; // Total number of pages, initialized to 1

      // Fetch posts in a loop until all pages are retrieved. A do...while loop is used to ensure that at least one request is made even if totalPages is initially incorrect.  This loop fetches posts from the API in batches, handling pagination
      do {
        // Construct the URL for the API request with pagination parameters.  `results_per_page=5` limits the number of results per page to 5.  This reduces the amount of data fetched at once.
        const response = await fetch(
          `${apiUrl}/api/posts?page=${currentPage}&results_per_page=5`,
          {
            // Include the Authorization header with the JWT token to authenticate the request.
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response is not ok (status code outside the 200-299 range) and throw an error if so.
        if (!response.ok) throw new Error("Failed to fetch posts");

        // Parse the JSON response from the API.  This gives you the data in a usable format (a Javascript object)
        const data = await response.json();
        // Extract the total number of pages from the response data.
        totalPages = data.totalPages;

        // Transform the fetched posts to a desired format.  This maps the post data from the API into a format that is easier to work with in the component. We are extracting id, title, content, tags, categories and author.  The original API structure might have additional or nested information that is not needed here
        const transformedPosts = data.posts.map((post) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          tags: post.tags.map((tag) => tag.name), // Extract tag names
          categories: post.categories.map((category) => category.name), //Extract category names
          author: post.author, //Author name
        }));

        // Add the transformed posts to the allPosts array. The spread syntax ... is used to combine the existing allPosts array with the new transformedPosts array.
        allPosts = [...allPosts, ...transformedPosts];
        // Increment the current page number to fetch the next page in the next iteration.
        currentPage++;
        // Continue the loop as long as the current page is less than or equal to the total number of pages.
      } while (currentPage <= totalPages);

      // After fetching all posts, extract unique authors, categories, and tags.

      const uniqueAuthors = [...new Set(allPosts.map((post) => post.author))]; //Use a Set to ensure uniqueness, then convert back to an array
      const uniqueCategories = [
        ...new Set(allPosts.flatMap((post) => post.categories)), //flatMap flattens nested arrays into a single array while mapping
      ];
      const uniqueTags = [...new Set(allPosts.flatMap((post) => post.tags))]; //flatMap to handle potentially multiple tags/categories per post

      // Update the state variables with the unique values.
      setAuthors(uniqueAuthors);
      setCategories(uniqueCategories);
      setTags(uniqueTags);
    } catch (error) {
      // Catch any errors during the process and log them to the console.
      console.error("Error fetching filter data:", error);
    }
  };

  // ... (previous code imports and fetchFiltersData function) ...

  // useEffect hook to fetch filter data when the component mounts.  The empty dependency array [] ensures this runs only once after the initial render.  This is similar to componentDidMount in class components
  useEffect(() => {
    fetchFiltersData(); // Call the function to fetch data
  }, []);

  // Return the JSX to render the component
  return (
    <div className={styles.blogFilters}>
      {" "}
      {/* Main container for the filters */}
      <div className={styles.filterRow}>
        {" "}
        {/* First row of filters (Search and Category) */}
        <div className={styles.filterGroup}>
          {" "}
          {/* Container for the search bar */}
          {/* Render the BlogSearch component */}
          <BlogSearch
            searchTerm={searchTerm} // Pass the current search term to the BlogSearch component
            onSearch={onSearch} // Pass the search handler function
            resultCount={resultCount} // Pass the number of search results
          />
        </div>
        <div className={styles.filterGroup}>
          {" "}
          {/* Container for the Category filter */}
          <label htmlFor="category">Category:</label>{" "}
          {/* Label for the category dropdown */}
          <select // Category dropdown
            id="category"
            value={filters.category || "all"} // Set the selected value, defaulting to "all"
            onChange={(e) => {
              // Event handler for when the selection changes
              const selectedCategory = e.target.value; // Get the selected category
              onFilterChange("category", selectedCategory); // Call the onFilterChange function with the selected category
            }}
          >
            {/* Default option to select all categories */}
            <option value="all">All Categories</option>
            {/* Map over the categories array to create options for each category */}
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.filterRow}>
        {" "}
        {/* Second row of filters (Author and Tags)  */}
        <div className={styles.filterGroup}>
          {" "}
          {/* Container for the Author filter */}
          <label htmlFor="author">Author:</label>
          <select //Dropdown for selecting an author
            id="author"
            value={filters.author || "all"} // Default to "all" if no author selected
            onChange={(e) => {
              //Handles changes to the author selection
              const selectedAuthor = e.target.value; // Get selected author from the event
              onFilterChange("author", selectedAuthor); // Update filters with selected author
            }}
          >
            <option value="all">All Authors</option>{" "}
            {/* Default option for all authors */}
            {/* Map over the authors array to dynamically create options for each author */}
            {dynamicAuthors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          {" "}
          {/* Container for tag filters */}
          <label>Tags:</label>
          <div className={styles.tagsFilter}>
            {" "}
            {/* Container for the tag checkboxes */}
            {/* Map over all available tags to create a checkbox for each one */}
            {allTags.map((tag) => (
              <label key={tag} className={styles.tagCheckbox}>
                {/* Checkbox for selecting a tag */}
                <input
                  type="checkbox"
                  // Set checked state based on if tag is in the current filters
                  checked={filters.tags.includes(tag)}
                  onChange={(e) => {
                    //Handle changes to the tag selection
                    //If the checkbox is checked, add the tag, otherwise remove it
                    const newTags = e.target.checked
                      ? [...filters.tags, tag] // Add tag if checked using spread operator
                      : filters.tags.filter((t) => t !== tag); // Remove tag if unchecked
                    onFilterChange("tags", newTags); // Update the filters
                  }}
                />
                {tag} {/* Display the tag name next to the checkbox */}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}); //End of the memoized BlogFilters function component

// PropTypes for type checking the component's props
BlogFilters.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string, // Category can be a string
    author: PropTypes.string, //Author can be a string
    tags: PropTypes.arrayOf(PropTypes.string).isRequired, // Tags must be an array of strings
  }).isRequired, // Filters prop is required
  onFilterChange: PropTypes.func.isRequired, // onFilterChange function is required
  searchTerm: PropTypes.string.isRequired, // searchTerm is required and a string
  onSearch: PropTypes.func.isRequired, // onSearch function is required
  resultCount: PropTypes.number.isRequired, // resultCount is required and a number
};

// Export the component as the default export
export default BlogFilters;
