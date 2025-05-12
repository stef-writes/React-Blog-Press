// Import necessary components and providers
import { RouterProvider } from "react-router-dom"; // Import RouterProvider for providing the router context
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider for providing authentication context
import { AppProviders } from "./providers/AppProviders"; // Import AppProviders for providing other application-level contexts
import { router } from "./router/index"; // Import the router configuration
import "./App.css"; // Import global CSS styles
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"; // Import ErrorBoundary for handling errors gracefully
import PerformanceMonitor from "./utils/PerformanceMonitor"; // Import PerformanceMonitor for tracking performance


// Define the App functional component - The root component of the application.
function App() {
  // Render the component JSX
  return (
    <div>
      {/* Wrap the application with ErrorBoundary to handle errors gracefully */}
      <ErrorBoundary>
        {/* Provide authentication context to the application */}
        <AuthProvider>
          {/* Provide other application-level contexts */}
          <AppProviders>
            <PerformanceMonitor /> {/* Include PerformanceMonitor to track performance */}
            {/* Render the application's routes using RouterProvider */}
            <RouterProvider router={router} />
          </AppProviders>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

// Export the App component as the default export
export default App;
