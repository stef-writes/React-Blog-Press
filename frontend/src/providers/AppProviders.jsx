// Imports context providers for Theme, Preferences, and Blog.
import { ThemeProvider } from '../contexts/ThemeContext';
import { PreferencesProvider } from '../contexts/PreferencesContext';
import { BlogProvider } from '../contexts/BlogContext';
// Imports PropTypes for component prop validation.
import PropTypes from 'prop-types';

// Defines a component called AppProviders that wraps its children with multiple context providers.
export function AppProviders({ children }) {
  // Returns the children wrapped in nested context providers.
  // This makes the context values available to all components nested within AppProviders.
  return (
    <ThemeProvider> {/* Provides theme context (e.g., light/dark mode) */}
      <PreferencesProvider> {/* Provides user preferences context */}
            {/* Provides blog-related data and functions */}
        <BlogProvider>{children}</BlogProvider> 
      </PreferencesProvider>
    </ThemeProvider>
  );
}

// Defines propTypes for the AppProviders component.
// Ensures that the 'children' prop is required and is a React node (e.g., JSX elements, text).
AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
