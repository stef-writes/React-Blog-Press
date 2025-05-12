// src/hook/useSearch.js
import { useState, useEffect, useMemo, useCallback } from 'react'; // Import necessary hooks from React.

export function useSearch(items, searchFields = ['title', 'content']) { // A custom hook for performing search on an array of items. Takes the items array and an optional array of searchFields as arguments. Default search fields are 'title' and 'content'.
  const [searchTerm, setSearchTerm] = useState(''); // State for storing the current search term entered by the user. Initialized as empty string.
  const [debouncedTerm, setDebouncedTerm] = useState('');  // State for storing the debounced search term (to avoid frequent searches). Initialized as empty string.  Using a debounced term helps in optimizing search so there aren't too many api calls as the user types
  const [isLoading, setIsLoading] = useState(false);   // State for tracking whether a search is currently in progress. Initialized as false.

  useEffect(() => {    // useEffect hook to debounce the search term.  This effect runs whenever the searchTerm changes.

    setIsLoading(true);     // Set isLoading to true when search term changes.  Provides visual feedback that a search is happening.
    const timerId = setTimeout(() => {   // Set a timeout to update the debouncedTerm after 1 second.  This is the core of the debounce logic.  If the user types quickly, only the last change will trigger a search after a 1 second pause in typing.
      setDebouncedTerm(searchTerm);  // Update debouncedTerm with the current searchTerm.
      setIsLoading(false);  // Set isLoading to false after debounced term is set.
    }, 1000);  //timeout duration of 1000 milliseconds (1 second).

      // Cleanup function to clear the timeout if the component unmounts or the searchTerm changes before the timeout completes.  This prevents memory leaks and unnecessary searches.
    return () => clearTimeout(timerId);  
  }, [searchTerm]); // Dependency array: this effect runs whenever searchTerm changes.

  const results = useMemo(() => {  // Memoized array of search results.
    if (!debouncedTerm) return items;   // If debouncedTerm is empty, return all items (no search).

    // Filter the items array based on the debounced search term.
    return items.filter(item =>      
      searchFields.some(field => {   // Check if at least one search field matches the debounced search term.  The some() method tests whether at least one element in the array passes the test implemented by the provided function.  
        const fieldValue = item[field];  //get value of field from item
        return (
          typeof fieldValue === 'string' &&    //check if fieldValue is string and if it includes debouncedTerm (case insensitive)
          fieldValue.toLowerCase().includes(debouncedTerm.toLowerCase())
        );
      })
    );
  }, [items, debouncedTerm, searchFields]);  // Dependency array: recalculate only when items, debouncedTerm, or searchFields change.

    // useCallback for memoizing the handleSearch function
  const handleSearch = useCallback((term) => {   // Function to handle changes in the search input. Takes the new search term as an argument.
    setSearchTerm(term);     // Update the searchTerm state with the new term.  This triggers the useEffect to debounce the search.
  },[]);  // Empty dependency array for memoization.  Since we're setting state, an empty dependency array is fine


  return {   // Return an object containing search-related data and functions.
    searchTerm,    // The current search term entered by the user.  
    handleSearch,  // The function to handle search input changes.
    results,      // The filtered search results.
    isSearching: searchTerm !== '',    // A boolean indicating whether a search is active (searchTerm is not empty).  Derived state - calculated from existing state, so more efficient than using another useState variable.
    isLoading,      // A boolean indicating whether the search is currently loading (debouncing).
  };
}
