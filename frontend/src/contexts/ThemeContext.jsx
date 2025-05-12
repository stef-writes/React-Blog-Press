import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create a context for managing the theme
const ThemeContext = createContext();

// Define light and dark themes using CSS custom properties (variables)
const themes = {
  light: {
    '--background-color': '#ffffff',
    '--text-color': '#000000',
  },
  dark: {
    '--background-color': '#121212',
    '--text-color': '#ffffff',
  },
};

export function ThemeProvider({ children }) {
  // Initialize the theme state from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';  //get theme from local storage if it exists otherwise default to light
  });

  useEffect(() => {
    // Get the root element of the document (usually <html>)
    const root = document.documentElement;

    // Set the data-theme attribute on the root element for styling purposes
    root.setAttribute('data-theme', theme);  //sets the data-theme attribute in the html tag

    // Apply the theme's CSS variables to the root element
    const themeVariables = themes[theme];
    for (const [key, value] of Object.entries(themeVariables)) {
      root.style.setProperty(key, value);  //loop through all the css variables and set them in the :root of the page so that those css variables can be accessed anywhere in the application
    }

    // Save the selected theme to localStorage for persistence
    localStorage.setItem('theme', theme);
  }, [theme]); // Run this effect whenever the theme changes

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));  //toggle the theme, if prevTheme is light then set it to dark and vice versa, this function will be called when user clicks on toggle theme button
  };

    // Provide the theme and toggleTheme function to all children components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Prop type validation for ThemeProvider
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to easily access the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);  //get the ThemeContext
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');  //throw error if context does not exist, this usually happens when we are trying to use useTheme hook outside of ThemeProvider
  }
  return context; //return the context which contains theme and toggleTheme function
};
