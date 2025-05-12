// Import CSS styles for the LoadingSpinner component
import "./LoadingSpinner.css";

// Define the LoadingSpinner functional component
const LoadingSpinner = () => {
  // Render the component JSX
  return (
    // Container for the loading spinner and text
    <div className="loading-spinner">
      <div className="spinner" /> {/* Spinner element with rotating animation (defined in CSS) */}
      <p>Loading...</p> {/* Loading text */}
    </div>
  );
};

// Export the LoadingSpinner component as the default export
export default LoadingSpinner;
