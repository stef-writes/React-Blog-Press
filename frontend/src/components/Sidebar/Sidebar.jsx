// Import necessary hooks from React for state management and effects
import { useState, useEffect } from "react";
// Import hooks for navigation from react-router-dom
import { useNavigate, NavLink } from "react-router-dom";
// Import CSS styles specific to the Sidebar component
import styles from "./Sidebar.module.css";
// Import the useTheme hook to access the current theme
import { useTheme } from "../../contexts/ThemeContext";

// Define the functional component Sidebar
function Sidebar() {
  // Initialize state variables using the useState hook
  const [isOpen, setIsOpen] = useState(false); // Controls whether the sidebar is open or closed, initially false (closed)
  const [categories, setCategories] = useState([]); // Stores the fetched categories
  const [recentPosts, setRecentPosts] = useState([]); // Stores the fetched recent posts
  const [loading, setLoading] = useState(false); // Indicates if data is being fetched, initially false

  // Hook for programmatic navigation, allows redirecting the user.
  const navigate = useNavigate();

  // Access the theme context to determine light or dark mode
  const { theme } = useTheme();

  // Asynchronous function to fetch posts and categories from the API
  const fetchPosts = async () => {
    setLoading(true); // Set loading to true while fetching data
    let allPosts = []; // Initialize an empty array to store all fetched posts
    let currentPage;
    const resultsPerPage = 5; //default value for number of results

    try {
      // Retrieve the authentication token from local storage
      const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");

      if (!token) {
        // If no token found, alert the user and return
        alert("Authentication token not found. Please log in.");
        return;
      }

      // Make an initial request to get the total number of pages
      const initialResponse = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/posts?page=1&results_per_page=${resultsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (!initialResponse.ok) {
        throw new Error("Failed to fetch posts."); // Throw an error if the request fails
      }

      const initialData = await initialResponse.json(); // Parse the JSON response
      currentPage = initialData.totalPages; //set current page to total pages so we can iterate backwards

      // Fetch posts in reverse page order to get the most recent ones first
      while (currentPage > 0 && allPosts.length < 5) {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/posts?page=${currentPage}&results_per_page=${resultsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch posts from page ${currentPage}.`);
        }

        const data = await response.json();
        console.log(`Fetched posts from page ${currentPage}:`, data.posts);

        // Map fetched posts to a simplified format and add them to allPosts
        allPosts = [
          ...allPosts,
          ...data.posts.map((post) => ({
            id: post._id,
            title: post.title,
            category: post.categories[0]?.name || "Uncategorized", // Extract category name or set to "Uncategorized"
            date: new Date(post.createdAt), // Convert date string to Date object
          })),
        ];

        currentPage--; // Decrement currentPage to move to the previous page
      }

      // Sort allPosts by date in descending order (newest first) and take the top 5
      const sortedPosts = allPosts.sort((a, b) => b.date - a.date).slice(0, 5);

      setRecentPosts(sortedPosts); // Update recentPosts state with the sorted and sliced posts

      // Extract unique categories from allPosts
      const uniqueCategories = Array.from(
        new Set(allPosts.map((post) => post.category))
      );
      setCategories(uniqueCategories); // Update categories state with unique categories
    } catch (error) {
      console.error("Error fetching posts:", error); // Log any errors to the console
      alert(error.message || "An error occurred while fetching posts."); // Display an error message to the user
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  // useEffect hook to fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Array of navigation items with their paths and labels
  const navItems = [
    { path: "/posts", label: "Blog" },
    { path: "/posts/new", label: "New Post" },
    { path: "/profile", label: "Profile" },
  ];

  // Function to toggle the sidebar's open/close state
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev); // Toggles the isOpen state
  };

  // Render the JSX for the Sidebar component
  return (
    <>
      {" "}
      {/* React Fragment to wrap multiple elements */}
      {/* Button to open the sidebar, uses a hamburger icon */}
      <button
        className={styles.sidebarToggle}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰ {/* Hamburger icon */}
      </button>
      <aside // The main sidebar element
        className={`${styles.sidebar} ${
          isOpen ? styles["sidebar--open"] : ""
        } ${theme === "dark" ? styles["sidebar--dark"] : ""}`} // Dynamically applies CSS classes based on state and theme
      >
        {/* Button to close the sidebar, only shown when sidebar is open */}
        {isOpen && (
          <button
            className={styles.sidebarClose}
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            × {/* Close icon */}
          </button>
        )}

        {/* Navigation links, rendered only when sidebar is open */}
        {isOpen && // Conditionally render navigation links when sidebar is open
          navItems.map((item) => (
            <section key={item.path} className={styles.sidebar__section}>
              {" "}
              {/* Wrap each link in a section */}
              <NavLink // Use NavLink for navigation with active styling
                to={item.path} // Path for the link
                className={(
                  { isActive } // Dynamically apply active class if link is currently active
                ) =>
                  `${styles.navigation__link} ${
                    isActive ? styles["is-active"] : ""
                  }`
                }
              >
                {item.label} {/* Display the label of the navigation item */}
              </NavLink>
            </section>
          ))}

        {/* Categories section */}
        <section className={styles.sidebar__section}>
          <h3 className={styles.sidebar__title}>Categories</h3>{" "}
          {/* Title for categories */}
          <ul className={styles.sidebar__list}>
            {" "}
            {/* Unordered list for categories */}
            {categories.map((category) => (
              <li key={category} className={styles.sidebar__item}>
                {" "}
                {/* List item for each category */}
                <button
                  onClick={() => {
                    // when clicked navigates to the posts page filtered by the selected category
                    const slug = category.toLowerCase().replace(/\s+/g, "-"); // creates a URL-friendly slug from the category name
                    // converts to lowercase and replaces spaces with hyphens
                    navigate(`/posts?category=${slug}`); // navigates to the /posts route with the category as a query parameter
                    setIsOpen(false); // closes the sidebar after navigation
                  }}
                  className={styles.sidebar__link}
                >
                  {category} {/* Display category name */}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent posts section */}
        <section className={styles.sidebar__section}>
          <h3 className={styles.sidebar__title}>Recent Posts</h3>{" "}
          {/* Title for recent posts */}
          <ul className={styles.sidebar__list}>
            {" "}
            {/* Unordered list for recent posts */}
            {recentPosts.map((post) => (
              <li key={post.id} className={styles.sidebar__item}>
                {" "}
                {/* List item for each post */}
                <button
                  onClick={() => {
                    // when clicked navigates to the specific post details page and closes the sidebar
                    navigate(`/posts/${post.id}`); // navigates to the post details route using the post ID
                    setIsOpen(false); //closes the sidebar
                  }}
                  className={styles.sidebar__link}
                >
                  {post.title} {/* Display post title */}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>
      {/* Overlay to close sidebar when clicked outside of it */}
      {isOpen && (
        <div className={styles.overlay} onClick={toggleSidebar}></div>
      )}{" "}
      {/* Conditionally render overlay when sidebar is open */}
    </>
  );
}

export default Sidebar;
