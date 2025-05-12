// Imports necessary components from React for creating context, managing state, and side effects.
import { createContext, useContext, useState, useEffect } from "react";
// Imports PropTypes for prop type validation.
import PropTypes from "prop-types";

// Creates a context object for managing user preferences.
const PreferencesContext = createContext();

// Defines default user preferences.
const defaultPreferences = {
  fontSize: "base", // Default font size.
  reducedMotion: false, // Default setting for reduced motion.
  language: "en", // Default language.
  layoutDensity: "comfortable", // Default layout density.
};

// Defines a component that provides user preferences to its children.
export function PreferencesProvider({ children }) {
    // Initializes state for preferences, using localStorage for persistence.
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("blog_preferences");
    return saved ? JSON.parse(saved) : defaultPreferences; //checking if there is anything in local storage, if yes use that or use default preferences
  });

    // useEffect hook to save preferences to localStorage and apply them to the DOM.
  useEffect(() => {
    // Saves preferences to localStorage whenever they change.
    localStorage.setItem("blog_preferences", JSON.stringify(preferences));

    // Gets the root element of the document.
    const root = document.documentElement;

        // Applies font size to the root element.
    const fontSizeMap = {
      small: "14px",
      base: "16px",
      large: "18px",
    };
    root.style.setProperty("--font-size", fontSizeMap[preferences.fontSize]);  //setting css variable --font-size

        // Apply layout density to the root element.
    const layoutDensityMap = {
      compact: "0.5rem",
      comfortable: "1rem",
    };
    root.style.setProperty(
      "--spacing",
      layoutDensityMap[preferences.layoutDensity]    //setting css variable --spacing
    );
  }, [preferences]); // The effect runs whenever the preferences value changes.

    // Defines a function to update a specific preference.
  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

    // Defines a function to reset preferences to their default values.
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Provides the preferences, updatePreference function, and resetPreferences function to consuming components.
  return (
    <PreferencesContext.Provider
      value={{ preferences, updatePreference, resetPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

// Defines propTypes for the PreferencesProvider component to ensure children is a valid React node.
PreferencesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Defines a custom hook for accessing preferences and related functions.
export const usePreferences = () => {
  const context = useContext(PreferencesContext); //Gets the context value from PreferencesContext using useContext.  This is how you access the value of a context
    //Throws an error if usePreferences is used outside of a PreferencesProvider.  this is useful for debugging
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context; // Returns the context value, which includes preferences, updatePreference, and resetPreferences.
};
