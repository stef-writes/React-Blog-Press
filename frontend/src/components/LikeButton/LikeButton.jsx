import { useState, useEffect } from "react"; // Import necessary React hooks
import PropTypes from "prop-types"; // Import PropTypes for prop type validation
import { FaHeart } from "react-icons/fa"; // Import the heart icon from react-icons
import styles from "./LikeButton.module.css"; // Import CSS styles for the component

// LikeButton component definition
function LikeButton({ postId, isDarkMode }) {
  //postId: The ID of the post, isDarkMode: Boolean indicating if dark mode is enabled
  // Initialize state variables using useState hook
  const [likes, setLikes] = useState(0); // State for tracking the number of likes for the post, initially 0
  const [isLiked, setIsLiked] = useState(false); // State for tracking whether the current user has liked the post, initially false

  // useEffect hook to fetch the initial like status and count when the component mounts or when the postId changes
  useEffect(() => {
    // Define an asynchronous function to fetch the likes for a post
    const fetchLikes = async () => {
      setIsLiked(false);
      setLikes(0);
      // Implementation to be completed
    };

    fetchLikes(); //Call the fetchLikes function to execute
  }, [postId]); // Run this effect whenever the postId changes

  const handleLikeClick = async () => {
    // Implementation to be completed
  };

  return (
    //Return JSX for the like button
    <button
      className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`} //Apply "liked" class if post is liked
      onClick={handleLikeClick} //Call handleLikeClick when button is clicked
      aria-label={isLiked ? "Unlike post" : "Like post"} //Set aria-label for accessibility
    >
      {/* Container for the heart icon, applying dark mode styles if enabled */}
      <div
        className={`${styles.iconContainer} ${
          isDarkMode ? styles.darkIconContainer : ""
        }`}
      >
        {/* Heart icon with dynamic styles based on like status and dark mode */}
        <FaHeart
          className={`${styles.likeIcon} ${
            isLiked ? styles.likedIcon : styles.unlikedIcon //Apply liked/unliked styles
          } ${isDarkMode && !isLiked ? styles.darkUnlikedIcon : ""}`} //Apply dark mode style if not liked and in dark mode
        />
      </div>
      {/* Display the number of likes with dynamic styles for dark mode */}
      <span
        className={`${styles.likeCount} ${
          isDarkMode ? styles.darkLikeCount : "" //Apply dark mode styles
        }`}
      >
        {likes} {/* Display the like count */}
      </span>
    </button>
  );
}

// PropTypes for type checking the component's props
LikeButton.propTypes = {
  postId: PropTypes.string.isRequired, // postId is required and must be a string (MongoDB ID)
  isDarkMode: PropTypes.bool.isRequired, //isDarkMode is required and must be a boolean
};

export default LikeButton; //Export the LikeButton component
