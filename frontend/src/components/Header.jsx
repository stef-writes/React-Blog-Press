import PropTypes from 'prop-types'; // Import PropTypes for prop validation

// Define the Header functional component
function Header({ isDarkMode, toggleDarkMode }) {
    // This component receives isDarkMode (boolean) and toggleDarkMode (function) as props
  return (
    <header className="blog-header"> {/* Header of the blog */}
      <h1>My Awesome Blog</h1> {/* Blog title */}
      <nav> {/* Navigation section */}
        <ul>
          <li><a href="#home">Home</a></li> {/* Link to the home section */}
          <li><a href="#about">About</a></li> {/* Link to the about section */}
        </ul>
      </nav>

            {/* Dark mode toggle switch */}
      <div className="toggle-switch" onClick={toggleDarkMode}> {/* Container for the toggle switch; calls toggleDarkMode when clicked */}
                {/* The slider element of the toggle switch; applies 'dark' class if isDarkMode is true */}
        <div className={`slider ${isDarkMode ? 'dark' : ''}`}></div>  
      </div>
    </header>
  );
}

// PropTypes for prop validation
Header.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,  // isDarkMode prop is required and must be a boolean
  toggleDarkMode: PropTypes.func.isRequired, // toggleDarkMode prop is required and must be a function
};

export default Header; // Export the Header component as the default export
