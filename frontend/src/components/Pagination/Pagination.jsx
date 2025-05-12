// src/components/Pagination.jsx
import { memo } from "react"; // Import memo for performance optimization (prevents re-renders if props haven't changed).
import PropTypes from "prop-types"; // Import PropTypes for prop type checking.
import styles from "./Pagination.module.css"; // Import CSS styles as a module.

const Pagination = memo(function Pagination({ currentPage, totalPages, onPageChange }) { // Memoized functional component for pagination.
  if (totalPages <= 1) return null; // If there's only one page or less, don't render pagination.

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);  //creates an array of page numbers from 1 to totalPages
  // Example: If totalPages is 5, pageNumbers will be [1, 2, 3, 4, 5]

  const handlePageClick = (pageNumber) => {  //function to handle page number click
    if (pageNumber !== currentPage) {  //if clicked page number is not the current page then call onPageChange with the clicked page number
      onPageChange(pageNumber);
    }
  };

  return (
    <div className={styles.pagination}>  {/* pagination container */}
      <button    //previous page button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage - 1)}  //call onPageChange with previous page number
        disabled={currentPage === 1}   //disable the button if current page is 1
        aria-label="Previous Page"     //aria label for accessibility
      >
        Previous
      </button>
      <div className={styles.pageNumbers}>   {/* page numbers container */}
        {pageNumbers.map((number) => (   //map over pageNumbers array and render a button for each page number
          <button
            key={number}    //key prop for react
            className={`${styles.pageNumber} ${  //base class for page number and active class if current page
              number === currentPage ? styles.active : ""
            }`}
            onClick={() => handlePageClick(number)}  //call handlePageClick when page number is clicked
            aria-label={`Page ${number}`}    //aria-label for accessibility
          >
            {number}    {/* display page number */}
          </button>
        ))}
      </div>
      <button     //next page button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage + 1)}  //call onPageChange with next page number
        disabled={currentPage === totalPages}   //disable the button if current page is the last page
        aria-label="Next Page"     //aria-label for accessibility
      >
        Next
      </button>
    </div>
  );
});    //memoizing the component

Pagination.propTypes = {    //proptypes for pagination component
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;    //export pagination component
