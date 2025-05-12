import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook for programmatic navigation.

function NotFound() { // Component function for the "Not Found" page.
  const navigate = useNavigate(); // Get the navigation function.

  return (
    <div>
      <h1>404 - Page Not Found</h1> {/* Display a heading indicating the error. */}
      <p>The page you are looking for does not exist.</p> {/* Display a descriptive message. */}
      <button onClick={() => navigate('/')}>Go to Home</button> {/* Button to navigate to the home page. */}
    </div>
  );
}

export default NotFound; // Export the NotFound component as the default export.
