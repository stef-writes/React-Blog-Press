import { Navigate } from "react-router-dom"; // Imports the Navigate component from React Router
import { useAuthContext } from "../../contexts/AuthContext"; // Imports the useAuthContext hook

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthContext(); // Accesses authentication status and loading state from context

  if (isLoading) {
    return <div>Loading...</div>; // Displays a loading message while authentication status is being checked
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />; // Renders children if authenticated, otherwise redirects to /login
}

export default ProtectedRoute; // Exports the ProtectedRoute component
