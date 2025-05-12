import { useState, useEffect, useCallback } from "react"; // Import necessary hooks from React.

export function useTheme() {  // A custom hook for managing the application's theme (light or dark).
    // Initialize the theme state with the value from localStorage or "light" if not found
  const [theme, setTheme] = useState(() => {  // State for storing the current theme. Initialized using a function to get the saved theme from localStorage on the initial render.  
    const savedTheme = localStorage.getItem("theme"); // Retrieve the saved theme from localStorage.
    return savedTheme || "light"; // Return the saved theme if it exists, otherwise default to "light".  This is a common pattern for initializing state with potentially persisted values.
  });

  // useEffect to update the DOM and localStorage whenever the theme changes  This synchronizes the theme across the application and persists it between sessions
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); // Set the data-theme attribute on the document's root element (html tag). This is a common way to apply a theme to the entire application using CSS variables or similar techniques.
    localStorage.setItem("theme", theme);  // Update the theme in localStorage whenever it changes.  This persists the user's preference.
  }, [theme]); // Dependency array: This effect runs whenever the theme state changes.

  // useCallback for memoizing the toggleTheme function. Prevents unnecessary re-renders of components using this hook.  
  const toggleTheme = useCallback(() => {  //function to toggle the theme between light and dark
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));  // Update the theme state. If the previous theme was "light", set it to "dark", and vice versa. This uses a functional update to correctly update the state based on the previous value.  Important when dealing with state updates that depend on previous state.
  }, []); // Empty dependency array for memoization (this function doesn't depend on any external values.)

  return {  // Return an object containing theme-related data and functions.
    theme,      // The current theme ("light" or "dark").
    isDark: theme === "dark", // A boolean indicating whether the current theme is "dark". Derived state - calculated from existing state rather than stored separately, which is more efficient.
    toggleTheme,  // The function to toggle the theme.
    setTheme,  //function to setTheme directly, useful if you have other ways to change the theme than just toggling.  Not used in this example, but provides flexibility.
  };
}
