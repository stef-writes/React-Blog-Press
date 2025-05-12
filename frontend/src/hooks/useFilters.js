// Import necessary hooks from React: useState for managing state and useMemo for memoizing values.
import { useState, useMemo } from "react";
// Import useNavigate for programmatic navigation.  Allows changing the current route.
import { useNavigate } from "react-router-dom";

// Define and export the custom hook useFilters.  It takes an array of items as an argument.
export function useFilters(items) {
  // The hook is designed to filter a list of items based on selected categories, authors, and tags.

  // Initialize the navigate hook for later use in navigation.
  const navigate = useNavigate();

  // Initialize state variable 'filters' with useState hook.
  // It stores the currently active filters.  Default values ensure no filtering initially.
  const [filters, setFilters] = useState({
    category: "all", // Initially set to 'all' to show all categories.
    author: "all", // Initially set to 'all' to show all authors.
    tags: [], // Initially an empty array, no tags selected.
  });

  // Memoize the unique categories using useMemo.  This prevents recalculation if 'items' haven't changed.
  // The 'categories' variable will always include 'all' as the first option.
  const categories = useMemo(
    () => ["all", ...new Set(items.flatMap((item) => item.categories))],
    // `flatMap` flattens the nested arrays of categories into a single array and `Set `object ensures uniqueness of categories.
    // The spread syntax `...` converts the Set back into an array and prepends "all".
    [items] // Recalculate only when 'items' changes. This is the dependency array.
  );

  // Memoize the unique authors using useMemo.
  // This value is recalculated only when the `items` array changes.
  const authors = useMemo(
    () => ["all", ...new Set(items.map((item) => item.author))],
    // `map` creates a new array with authors from each item. `Set` object ensures uniqueness of authors.
    // The spread syntax `...` converts the Set back into an array and prepends "all".

    [items]
  );

  // Memoize the unique tags using useMemo.
  // This prevents recalculating all tags if the `items` array hasn't changed.
  const allTags = useMemo(
    () => [...new Set(items.flatMap((item) => item.tags))], // Flattens the array of tags from each item and a Set is used to get the unique values. Then it's converted back to an array using spread operator.
    [items]
  );

  // Memoize the filtered items using useMemo.  This is the core filtering logic.
  // This ensures that the filtering operation is performed only when `items` or `filters` change.  Performance optimization
  const filteredItems = useMemo(() => {
    // Filter the items based on the current filter values.
    return items.filter((item) => {
      // Check if the item matches the category filter.
      // Updated to handle cases where item.categories is null or undefined.  Uses optional chaining `?.` and the nullish coalescing operator `??`
      const categoryMatch =
        !filters.category ||
        filters.category === "all" ||
        (item.categories || []).includes(filters.category);
      // if filters.category is falsy (empty string or null), or is set to "all" then categoryMatch is true (no category filtering)
      // checks if the item's categories array includes the selected category

      const authorMatch =
        !filters.author ||
        filters.author === "all" ||
        item.author === filters.author; // Similar logic for author matching.
      // if filters.author is falsy, or is "all", then authorMatch is true
      // otherwise check for exact match between item author and the filter

      // Check if the item matches the selected tags. At least one tag should match
      const tagsMatch =
        filters.tags.length === 0 ||
        filters.tags.some((tag) => (item.tags || []).includes(tag)); // if no tags are selected in the filter, then tagsMatch is true
      // otherwise, checks if at least one selected tag is present in the item's tags

      // Return true if the item matches all filter criteria.
      return categoryMatch && authorMatch && tagsMatch;
    });
  }, [items, filters]); // Recalculate only when 'items' or 'filters' change.

  // Function to handle filter changes.
  const handleFilterChange = (filterType, value) => {
    // Update the filter state using the functional form of setFilters to avoid potential issues with stale state values.
    setFilters((prev) => ({
      ...prev, // Spread the previous filter values to keep other filters unchanged.
      [filterType]: value === "all" ? "" : value, // Update the specified filter type with the new value. Set to empty string if 'all' is selected to clear that specific filter
    }));
  };

  // Return an object containing the filter-related data and functions.
  return {
    filters, // Current filter values.
    handleFilterChange, // Function to update filters.
    filteredItems, // Items filtered based on current filter values.
    categories, // Available categories for filtering.
    authors, // Available authors for filtering.
    allTags, // All available tags for filtering.
  };
}
