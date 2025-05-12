// Import the memo function for performance optimization.
import { memo } from "react";
// Import PropTypes for prop type checking.
import PropTypes from "prop-types";
// Import CSS styles specific to this component as a module.
import styles from "./BlogSearch.module.css";

// Define the functional component BlogSearch and memoize it for performance optimization.
const BlogSearch = memo(function BlogSearch({
  searchTerm,
  onSearch,
  resultCount,
}) {

  // Return the JSX to render the component.
  return (
    <div className={styles.blogSearch}>
      <div className={styles.searchGroup}>
        <label htmlFor="searchPosts">Search Posts:</label>
        {/* Input field for searching blog posts. */}
        <input
          id="searchPosts"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)} // Call the onSearch function with the new search term when the input value changes.
          className={styles.searchInput}
        />
        {/* Display the number of search results if there is a search term. */}
        {searchTerm && (  // Conditionally render the search result count if searchTerm is not empty.
          <span className={styles.searchResultsCount}>
            {resultCount} results found
          </span>
        )}
      </div>
    </div>
  );
});

// Define PropTypes for the component's props.
BlogSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired, // searchTerm is required and must be a string.
  onSearch: PropTypes.func.isRequired,    // onSearch is required and must be a function.
  resultCount: PropTypes.number.isRequired, // resultCount is required and must be a number.
};

// Export the BlogSearch component as the default export.
export default BlogSearch;
