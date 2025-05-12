// src/pages/Home.jsx
// Import useState hook from React library
import { useState } from 'react';
// Import the BlogList component to display the list of blog posts
import BlogList from '../components/BlogList/BlogList';
// Import CSS styles for the component
import styles from './Home.module.css';

// Define the Home functional component
function Home() {
  // Initialize state for dark mode using useState hook
  // The initial value is retrieved from localStorage, defaulting to false if not found
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Render the component JSX
  return (
    // Container div with styles from Home.module.css
    <div className={styles.home}>
      {/* Main content area */}
      <main className={styles.mainContent}>
        {/* Render the BlogList component, passing the isDarkMode state as a prop */}
        <BlogList isDarkMode={isDarkMode} />
      </main>
    </div>
  );
}

// Export the Home component as the default export
export default Home;
