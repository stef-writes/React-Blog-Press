import { useState, useEffect, useCallback } from "react"; // Imports necessary hooks from React
import axios from "axios"; // Imports axios for making API requests

export function useAuth() {
  const [user, setUser] = useState(null); // Initializes user state to null
  const [isLoading, setIsLoading] = useState(true); // Initializes loading state to true

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user"); // Retrieves user data from localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Sets user state with parsed user data
    }
    setIsLoading(false); // Sets loading state to false after loading
  }, []);

  // useCallback hook to memoize the register function, preventing unnecessary re-renders
  const register = useCallback(async (credentials) => {
    try {
      setIsLoading(true); // Sets loading state to true to indicate registration is in progress
      // Send a POST request to the API endpoint for user registration
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`, // API endpoint URL
        credentials // User registration credentials (e.g., name, email, password)
      );

      //if registration is successful return the API response which may contain user data or a success message
      return response;
    } catch (error) {
      // If an error occurs during registration (e.g., network error, server error),
      // throw a new error with a descriptive message.  If the error response from the server
      // includes a message, use that; otherwise, use a generic "Registration failed" message.
      throw new Error(error.response?.data?.message || "Registration failed");
    } finally {
      // Regardless of whether registration succeeds or fails, set the loading state back to false
      // to indicate that the registration process is complete. This ensures that any loading indicators
      // (e.g., spinners) are hidden.
      setIsLoading(false);
    }
  }, []); // The empty dependency array ensures this function is only created once when the component renders

  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true); // Sets loading state to true during login
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        credentials
      ); // Sends login request to API

      const { user: loggedInUser, token } = response.data; // Extracts user and token from response
      const userData = { ...loggedInUser, token }; // Creates userData object

      setUser(userData); // Sets user state with userData
      localStorage.setItem("auth_user", JSON.stringify(userData)); // Stores userData in localStorage
      return userData; // Returns userData
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed"); // Throws error with message
    } finally {
      setIsLoading(false); // Sets loading state to false after login attempt
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true); // Sets loading state to true during logout

      // Retrieve the token from localStorage
      const { token, ...userDetails } = JSON.parse(
        localStorage.getItem("auth_user") || "{}"
      );

      // Sends logout request to API with the token in the Authorization header
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {}, // No payload for the logout request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token as a Bearer token
          },
        }
      );

      // Sets user state to null on successful logout
      setUser(null);

      // Removes user data from localStorage
      localStorage.removeItem("auth_user");

      return true; // Return true on successful logout
    } catch (error) {
      // Throw an error with a message
      throw new Error(error.response?.data?.message || "Logout failed");
    } finally {
      // Sets loading state to false after logout attempt
      setIsLoading(false);
    }
  }, []);

  return {
    user, // Returns user state
    isLoading, // Returns loading state
    isAuthenticated: !!user, // Returns true if user is logged in, false otherwise
    login, // Returns login function
    logout, // Returns logout function
    register,
  };
}
