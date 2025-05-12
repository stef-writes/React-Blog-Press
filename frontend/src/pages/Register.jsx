import { useState } from "react"; // Import the useState hook for managing component state
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for programmatic navigation
import styles from "./Register.module.css"; // Import CSS styles specific to this component
import { useAuthContext } from "../contexts/AuthContext"; // Import custom hook for authentication logic

const Register = () => {
  // Initialize state variables using useState hook
  const [formData, setFormData] = useState({
    name: "", // Input field for user's name
    email: "", // Input field for user's email
    password: "", // Input field for user's password
  }); 
  const [error, setError] = useState(""); // State variable to store error messages
  const [loading, setLoading] = useState(false); // State variable to track loading status during API calls

  // Access the register function from the AuthContext
  const { register } = useAuthContext(); 
  
  // Initialize useNavigate for redirecting users
  const navigate = useNavigate(); 

  // Event handler for input field changes
  const handleChange = (e) => {
    // Update the formData state whenever an input field changes
    // Using spread syntax to maintain existing data and update only the changed field
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  };

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setLoading(true); // Set loading state to true to indicate API call in progress
    setError(""); // Clear any previous error messages

    try {
       // Call the register function (from AuthContext) with form data
      const response = await register(formData);
      alert(response.data.message); // Display a success message to the user using an alert
      setFormData({ name: "", email: "", password: "" }); // Clear the form fields after successful registration
      navigate("/login"); // Redirect the user to the login page
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message); // Log the error for debugging
      // Set the error message to display to the user, handling potential missing response data
      setError(
        err.response?.data?.message || "User Already Exist."
      ); 
    } finally {
      setLoading(false); // Set loading state back to false regardless of success or failure
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Your Account</h2>
      {error && <p className={styles.error}>{error}</p>} {/* Display error */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading} // Disable button when loading
        >
          {loading ? "Processing..." : "Sign Up"}
        </button>
      </form>
      <p className={styles.text}>
        Already registered?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={styles.link}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Register; // Export the Register component
