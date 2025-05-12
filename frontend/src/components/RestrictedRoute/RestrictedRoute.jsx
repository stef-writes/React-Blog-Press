import { Navigate } from "react-router-dom"; // Imports the Navigate component from React Router
import { useAuthContext } from "../../contexts/AuthContext"; // Imports the useAuthContext hook

function RestrictedRoute({ children }) {
  const { isAuthenticated } = useAuthContext(); // Accesses authentication status from context

  return isAuthenticated ? <Navigate to="/posts" replace /> : children; // Redirects to /posts if authenticated, otherwise renders children
}

export default RestrictedRoute; // Exports the RestrictedRoute component
