// src/hooks/usePagination.js
import { useMemo, useState, useCallback } from 'react'; // Import necessary hooks from React.

export function usePagination(items, itemsPerPage = 10) { // A custom hook for paginating an array of items. Takes the items array and the number of items per page as arguments. Default itemsPerPage is 10.  
  const [currentPage, setCurrentPage] = useState(1); // State for the current page number. Initialized to 1.

  const totalPages = useMemo(() => // Memoized value for the total number of pages.
    Math.ceil(items.length / itemsPerPage),  // Calculate total pages by dividing the number of items by itemsPerPage and rounding up to the nearest integer using Math.ceil.
    [items.length, itemsPerPage] // Dependency array: Recalculate only when items.length or itemsPerPage changes.
  );

    // Memoized array of paginated items for the current page.
  const paginatedItems = useMemo(() => {  
    const start = (currentPage - 1) * itemsPerPage;  // Calculate the starting index for slicing the items array.
    return items.slice(start, start + itemsPerPage);    // Slice the items array to get the items for the current page.
  }, [items, currentPage, itemsPerPage]);  // Dependency array: Recalculate only when items, currentPage, or itemsPerPage changes.

    // useCallback for memoizing the goToPage function
  const goToPage = useCallback((page) => {   // Function to go to a specific page.  Takes the page number as an argument.
    const pageNumber = Math.max(1, Math.min(page, totalPages));  // Ensure the page number is within the valid range (1 to totalPages).  Uses Math.max and Math.min to clamp the value.
    setCurrentPage(pageNumber);  // Update the currentPage state.
  }, [totalPages]); // Dependency array: This function depends on totalPages.

    // useCallback for memoizing the nextPage function
  const nextPage = useCallback(() => {   //function to go to next page
    goToPage(currentPage + 1);     //call goToPage with next page number
  }, [currentPage, goToPage]);   // Dependency array: This function depends on currentPage and goToPage.

    // useCallback for memoizing the prevPage function
  const prevPage = useCallback(() => {    //function to go to previous page
    goToPage(currentPage - 1);      //call goToPage with previous page number
  }, [currentPage, goToPage]);  // Dependency array: This function depends on

  return {  // Return an object containing pagination-related data and functions.
    items: paginatedItems, // The array of items for the current page.
    currentPage,          // The current page number.
    totalPages,          // The total number of pages.
    goToPage,            // Function to go to a specific page.
    nextPage,            // Function to go to the next page.
    prevPage,            // Function to go to the previous page.
    hasNext: currentPage < totalPages,  // Boolean indicating if there's a next page.  Derived state, more efficient than storing in state.
    hasPrev: currentPage > 1           // Boolean indicating if there's a previous page. Derived state.
  };
}
