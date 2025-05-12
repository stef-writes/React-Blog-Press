// Import PropTypes for prop type validation
import PropTypes from "prop-types";
// Import ErrorBoundary component from react-error-boundary library
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
// Import CSS styles for the component
import styles from "./ErrorBoundary.module.css";

// Define the ErrorFallback component to display an error message and a retry button
function ErrorFallback({ error, resetErrorBoundary }) { // Receives error and resetErrorBoundary props from the ErrorBoundary component
  return (
    <div className={styles.errorBoundary}> {/* Apply error boundary styles */}
      <h2>Something went wrong</h2> {/* Error title */}
      <p>{error.message}</p> {/* Display the error message */}
      {/* Button to reset the error boundary and retry rendering */}
      <button
        onClick={resetErrorBoundary} // Call the resetErrorBoundary function when clicked
        className={styles.errorBoundaryRetry} // Apply retry button styles
      >
        Try Again {/* Button label */}
      </button>
    </div>
  );
}

// Define the ErrorBoundary component, which wraps its children and handles errors
function ErrorBoundary({ children, fallback }) { // Receives children and an optional fallback component as props
    // Render the component JSX
  return (
    // Use the ErrorBoundary component from react-error-boundary
    <ReactErrorBoundary
      FallbackComponent={fallback || ErrorFallback} // Use the provided fallback component or the default ErrorFallback component
      // onReset callback function to be called when the error boundary resets
      onReset={() => {
        // You can add custom logic here to reset the application state if necessary
        
        // For now, we just reload the page
        window.location.reload(); // Reload the page when the error boundary resets
      }}
      
    >
            {/* Render the children components within the error boundary */}
      {children} 
    </ReactErrorBoundary>
  );
}

// Define propTypes for the ErrorBoundary component
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired, // Children prop is required and must be a React node
  fallback: PropTypes.func, // Fallback prop is optional and must be a function (a React component)
};

// Export the ErrorBoundary component as the default export
export default ErrorBoundary;
