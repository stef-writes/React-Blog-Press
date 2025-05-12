/* eslint-disable no-unused-vars */ // Disables ESLint warning for unused variables 
// src/components/Navigation - This comment indicates the file path and component name

// Import necessary components from React Router for navigation
import { NavLink, useNavigate } from "react-router-dom";
// Import useState hook for managing component state
import { useState } from "react";

// Import CSS styles specific to this component using CSS Modules
import styles from "./Navigation.module.css";
//imports authentication context
import { useAuthContext } from "../../contexts/AuthContext";

// Define the Navigation functional component
function Navigation() {
  // Use useState to manage whether the navigation menu is open (for mobile view)
  // Initially, the menu is closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // useNavigate hook for programmatic navigation within the application
  const navigate = useNavigate();
  // Access the logout function from the AuthContext
  const { logout } = useAuthContext();

  // Define an array of navigation items, each with a path and a label to display
  const navItems = [
    { path: "/posts", label: "Blog" }, //links to blog page
    { path: "/post-manager", label: "Posts" }, // links to post manager page
    { path: "/form", label: "Form" }, //links to form page
    { path: "/posts/new", label: "New Blog" }, //links to new blog page
    { path: "/profile", label: "Profile" }, //links to profile page
    { path: "/settings", label: "Settings" }, // links to settings page
  ];

  // Function to toggle the menu's open/closed state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Inverts the current isMenuOpen state
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from AuthContext
      console.log("User state cleared successfully."); // Log successful logout
      // Redirect the user to the login page after logout
      navigate("/login");
    } catch (error) {
      // Handle logout errors
      console.error(
        "Error during logout:",
        error.response?.data || error.message
      ); // Log the error
      alert("Error during logout. Please try again."); // Display an alert to the user
    }
  };

  // Render the component JSX
  return (
    // Navigation container with styles
    <nav className={styles.navigation}>
      {/* Brand/logo container */}
      <div className={styles.navigation__brand}>MyBlog</div>{" "}
      {/* Replace with your blog's name or logo */}
      {/* Button to toggle the mobile menu */}
      <button
        className={styles.navigation__toggle} // Apply styles for the toggle button
        onClick={toggleMenu} // Call the toggleMenu function when clicked
        aria-expanded={isMenuOpen} // Set aria-expanded attribute to indicate menu state for accessibility
        aria-label="Toggle navigation" // Set aria-label for accessibility
      >
        <span className={styles.navigation__toggleIcon}></span>{" "}
        {/* Placeholder for the toggle icon (e.g., hamburger icon) */}
      </button>
      {/* Navigation menu (unordered list) */}
      <ul
        className={`${styles.navigation__menu} ${
          isMenuOpen ? styles["is-open"] : "" // Apply "is-open" class if the menu is open
        }`}
      >
        {/* Render navigation items */}
        {navItems.map((item) => (
          <li key={item.path} className={styles.navigation__item}>
            {" "}
            {/* Use unique key for each list item */}
            {/* Use NavLink to render navigation links with active styling */}
            <NavLink
              to={item.path} // Set the link path
              className={(
                { isActive } // Apply active class if the link is currently active
              ) =>
                `${styles.navigation__link} ${
                  isActive ? styles["is-active"] : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)} // Close the menu when a link is clicked
            >
              {item.label} {/* Display the link label */}
            </NavLink>
          </li>
        ))}
      </ul>
      {/* Display the logout button */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

// Export the Navigation component as the default export
export default Navigation;
