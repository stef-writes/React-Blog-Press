// Import custom hooks for filtering, searching, and pagination
import { useFilters } from "../../hooks/useFilters";
import { useSearch } from "../../hooks/useSearch";
import { usePagination } from "../../hooks/usePagination";
// Import components for filtering, pagination, and displaying blog posts
import BlogFilters from "../BlogFilters/BlogFilters";
import Pagination from "../Pagination/Pagination";
import BlogPost from "../BlogPost/BlogPost";
// Import PropTypes for prop type validation
import PropTypes from "prop-types";
// Import CSS styles for the component
import styles from "./BlogList.module.css";
// Import the useBlog hook to access blog data from context
import { useBlog } from "../../contexts/BlogContext";
import AnimatedList from "../../components/AnimatedList/AnimatedList";
import LoadingState from "../LoadingState/LoadingState";

// Define the number of posts to display per page
const POSTS_PER_PAGE = 5;

// Define the BlogList functional component
function BlogList({ isDarkMode, filteredPosts }) {

  // Receives props for dark mode, filter change handler, and pre-filtered posts
  // Access the blog context state using the useBlog hook
  const { state } = useBlog();
  // Destructure posts, isLoading, and error from the blog context state
  const { posts, isLoading, error } = state;

  const {
    filters, // Current filter values
    handleFilterChange, // Function to handle filter changes
    filteredItems, // Filtered blog posts
    categories, // Available categories
    authors, // Available authors
    allTags, // Available tags
  } = useFilters(filteredPosts || posts); // Pass either pre-filtered posts or all posts to the hook


  // Use the useSearch hook to manage searching of blog posts
  const {
    searchTerm, // Current search term
    handleSearch, // Function to handle search input changes
    results: searchResults, // Search results
    isSearching, // Flag indicating if a search is currently active
  } = useSearch(filteredItems, [
    "title",
    "content",
    "author",
    "tags",
    "category",
  ]); // Pass filtered items and searchable fields to the hook

  // Determine which posts to display based on search status
  const displayedPosts = isSearching ? searchResults : filteredItems; // Display search results if searching, otherwise display filtered items

  // Use the usePagination hook to manage pagination of displayed posts
  const {
    items: currentPosts, // Posts to display on the current page
    currentPage, // Current page number
    totalPages, // Total number of pages
    goToPage, // Function to go to a specific page
  } = usePagination(displayedPosts, POSTS_PER_PAGE); // Pass displayed posts and posts per page to the hook

  // Render an error message if there is an error
  if (error) {
    return (
      <div className={styles.error}>
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  // Render the component JSX
  return (
    <div>
      {/* Container for blog controls (search and filters) */}
      <div className={styles.blogControls}>
        <BlogFilters
          filters={filters} // Current filter state from useFilters.js
          onFilterChange={handleFilterChange} // Function to update filters state
          searchTerm={searchTerm} // Search term state
          onSearch={handleSearch} // Function to update search term
          resultCount={searchResults.length} // Number of results matching search term
          categories={categories} // Available categories from useFilters.js
          authors={authors} // Available authors from useFilters.js
          allTags={allTags} // Available tags from useFilters.js
        />
      </div>
      {/* Container for the blog list */}
      <div className={styles.blogList}>
        {/* Conditionally render loading state, blog posts, or no results message */}
        {isLoading ? (
          <LoadingState count={3} />
        ) : currentPosts.length > 0 ? (
          <>
            {/* Container for blog posts */}
            <div className={styles.blogPosts}>
              {/* Render an AnimatedList to display the blog posts with animations */}
              <AnimatedList
                items={currentPosts}
                renderItem={(post) => (
                  <BlogPost
                    key={post.id}
                    {...post}
                    isDarkMode={isDarkMode}
                    searchTerm={searchTerm}
                  />
                )}
              />
            </div>

            {/* Pagination component */}
            <Pagination
              currentPage={currentPage} // Pass current page number to the component
              totalPages={totalPages} // Pass total number of pages to the component
              onPageChange={goToPage} // Pass page change handler function to the component
            />
          </>
        ) : (
          <div className={styles.noResults}>
            <p>No posts found matching your criteria.</p>
            <p>
              Try adjusting your search or filters. If no posts are available,
              please add a new post to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Define propTypes for the BlogList component
BlogList.propTypes = {
  isDarkMode: PropTypes.bool.isRequired, // isDarkMode prop is required and must be a boolean
  onFilterChange: PropTypes.func, // onFilterChange prop is optional and must be a function
  filteredPosts: PropTypes.array, // filteredPosts prop is optional and must be an array
};

// Export the BlogList component as the default export
export default BlogList;
