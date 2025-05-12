import { useState } from "react"; // Import necessary modules from React
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { useAuthContext } from "../contexts/AuthContext"; // Import custom authentication context
import styles from "./Login.module.css"; // Import CSS styles for the component

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" }); // Initialize state for login credentials
  const [error, setError] = useState(null); // Initialize state for error messages
  // Get the login function from the AuthContext
  const { login } = useAuthContext();
  // Initialize useNavigate for navigation
  const navigate = useNavigate();

  // Event handler for input field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the input event
    // Update the credentials state with the new input value
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      setError(null); // Clear any previous error messages
      // Call the login function from AuthContext with the entered credentials
      const response = await login(credentials);
      // Check if a token is received in the response (indicating successful login)
      if (response.token) {
        // Store the token in localStorage for later use
        localStorage.setItem("userAccessToken", response.token);
      }
      // Redirect to the /posts page after successful login
      navigate("/posts");
    } catch (err) {
      console.error("Login error:", err.message); // Log the error message for debugging
      setError("Invalid email or password. Please try again."); // Set an error message for the user
    }
  };

  return (
    // Main container for the login page
    <div className={styles.loginPage}>
      <div className={styles.formContainer}>
        <h2>Welcome Back</h2>
        {/* Form for login credentials */}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {/* Email input field */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange} // Call handleChange on input change
              required //makes field required
            />
          </div>
          {/* Password input field */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange} // Call handleChange function on input change
              required
            />
          </div>
          {/* Display error message if there's an error */}
          {error && <p className={styles.error}>{error}</p>}
          {/* Login button to submit the form */}
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        {/* Prompt for users who don't have an account to sign up */}
        <p className={styles.signupPrompt}>
          Don't have an account?{" "}
          {/* Button to navigate to the registration page */}
          <button
            className={styles.signupButton}
            onClick={() => navigate("/register")} // Redirect to /register on click
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login; // Export the Login component
