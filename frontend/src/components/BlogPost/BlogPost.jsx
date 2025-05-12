import { useEffect, useState } from "react"; // Import necessary React hooks
import PropTypes from "prop-types"; // Import PropTypes for prop type checking
import { FaWhatsapp, FaLinkedin, FaInstagram } from "react-icons/fa"; // Import social media icons from react-icons
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown to render Markdown content
import styles from "./BlogPost.module.css"; // Import CSS styles
import LikeButton from "../LikeButton/LikeButton"; // Import LikeButton component
import CommentSection from "../CommentSection/CommentSection"; // Import CommentSection component
import { calculateReadTime } from "../../utils/readTime"; // Import read time calculation utility
import OptimizedImage from "../OptimizedImage/OptimizedImage"; // Import OptimizedImage component for image optimization

// Functional component for a single blog post
function BlogPost({
  id, // Unique identifier for the blog post
  title, // Title of the blog post
  content = "", // Content of the blog post, defaulting to an empty string
  author, // Author of the blog post
  date, // Date of the blog post
  image, // URL of the image for the blog post
  isDarkMode, // Flag indicating if dark mode is enabled
  isPreview = false, // Flag indicating if the post is a preview (default: false)
  searchTerm, // the search term for highlighting the results
}) {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage whether the post content is expanded or not
  const [readTime, setReadTime] = useState(0); // State to store the calculated read time
  const navigate = useNavigate(); // Hook for programmatically navigating

  //UseEffect to calculate read time when the content changes.  The dependency array [content] ensures this runs only when the content changes
  useEffect(() => {
    setReadTime(calculateReadTime(content)); // Calculate and set read time
  }, [content]);

  // Function to toggle the expansion state of the post content
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded); // Toggle the isExpanded state
  };

  // Function to handle deleting a post
  const handleDelete = async () => {
    // TODO
    // 1. Retrieve User Authentication Information
          // Objective: Access the currently logged-in user's authentication details.
          // Steps:
                // Use localStorage.getItem("auth_user") to retrieve the stored user information.
                // Parse the JSON string into an object using JSON.parse().
                // Extract the token for authentication and currentUserId to identify the user.
    
    // 2. Check for User Authentication
          // Objective: Ensure the user is logged in before proceeding.
          // Steps:
                // Verify that the token exists.
                // If the token is missing, display an alert message:
                // "Authentication token not found. Please log in."
                // Terminate further execution by returning early.
    
    // 3. Verify User Authorization
          // Objective: Allow only the author of the post to delete it.
          // Steps:
                // Compare the author of the post with currentUserId.
                // If they do not match, display an alert message:
                // "You are restricted to delete this post, as you are not the owner."
                // Prevent unauthorized deletion by returning early.
    
    // 4. Send DELETE Request
          // Objective: Communicate with the API to delete the post.
          // Steps:
                // Construct the API URL using the post ID:
                // ${import.meta.env.VITE_API_URL}/api/posts/${id}.
                // Use the fetch API to send a DELETE request:
                // Include the Authorization header with the token.
                // Specify the HTTP method as DELETE.
                // Await the response from the server.
    
    // 5. Handle API Response
          // Objective: Check if the post was deleted successfully.
          // Steps:
                // Use response.ok to verify the response status.
                // If the response is not successful:
                // Throw a new error with the message:
                // "Failed to delete the post. Please try again."
                // Display an alert message on success:
                // "Post deleted successfully!"
    
    // 6. Redirect to Home Page
          // Objective: Navigate to the home page after the post is deleted.
          // Steps:
                // Use the navigate("/") function to redirect the user to the home page.
                // Ensure this step occurs only after successful deletion.
    
    // 7. Handle Errors
          // Objective: Gracefully handle any errors during the process.
          // Steps:
                // Use a try...catch block to wrap the logic.
                // In the catch block:
                // Display the error message using alert().
                // Log the error for debugging purposes, if necessary.
  };

  const displayContent = isExpanded
    ? content // If isExpanded is true, display the full content.
    : content?.slice(0, 200) + (content?.length > 200 ? "..." : ""); // Otherwise, display a truncated version with ellipsis if the content is longer than 200 characters.

  const highlightText = (text, term) => {
    //function to highlight the searched text
    if (!term || !text) return text; // If search term is empty or text is empty or null, return the original text.
    const regex = new RegExp(`(${term})`, "gi"); // Create a regular expression to match the search term (case-insensitive and globally).
    return text.split(regex).map(
      (
        part,
        index //splits the text by search term matches
      ) =>
        regex.test(part) ? ( //check if the current part matches the search term
          <span key={index} className={styles.highlight}>
            {part}
          </span>
        ) : (
          part //if not matched return the original part
        )
    );
  };

  return (
    //JSX to render the BlogPost component
    <article className={`${styles.blogPost} ${isDarkMode ? styles.dark : ""}`}>
      {" "}
      {/* Apply dark mode styles if isDarkMode is true */}
      {/* Display the image if available */}
      {image && (
        <OptimizedImage
          src={image} // Pass the image source
          alt={title} // Set alt text for accessibility
          width={600} // Set a fixed width  (can be adjusted)
          height={400} // Set a fixed height (can be adjusted)
        />
      )}
      <div className={styles.blogPost__header}>
        {" "}
        {/* Container for the header elements */}
        <h2 className={styles.blogPost__title}>
          {" "}
          {/* Title of the blog post  */}
          {highlightText(title, searchTerm)}{" "}
          {/* Highlight search term in the title */}
        </h2>
        <div className={styles.blogPost__meta}>
          {" "}
          {/* Container for meta information (author, date, read time) */}
          <span className={styles.blogPost__author}>
            By {highlightText(author, searchTerm)}{" "}
            {/* Author with search term highlighting */}
          </span>
          <time className={styles.blogPost__date}>{date}</time>{" "}
          {/* Date of the post */}
          <span className={styles.blogPost__readTime}>
            {" "}
            {/* Display calculated read time */}
            {readTime} min read
          </span>
        </div>
      </div>
      {/* Action buttons (Edit, Delete) only if not a preview */}
      {!isPreview && (
        <div className={styles.actionButtons}>
          <button // Button to navigate to edit page
            className={styles.toggleButton}
            onClick={() => navigate(`/posts/${id}/edit`)} // Navigate to edit route
            aria-expanded={isExpanded} // Accessibility attribute indicating expanded state
          >
            Edit
          </button>
          <button //Button to delete the post
            className={`${styles.toggleButton} ${styles.deleteButton}`} // Combine button styles with delete button specific style
            onClick={handleDelete} // Call handleDelete function when clicked
          >
            Delete
          </button>
        </div>
      )}
      {/* Container for the blog post content, dynamically applying styles based on expanded state */}
      <div
        className={`${styles.blogPost__content} ${
          isExpanded ? styles.expanded : "" // Apply expanded class if isExpanded is true
        }`}
      >
        {/* Render the content as Markdown using ReactMarkdown */}
        {isPreview ? ( // Conditionally render based on if it's a preview
          <ReactMarkdown>{displayContent}</ReactMarkdown> // Render preview content as markdown
        ) : (
          <ReactMarkdown>{displayContent}</ReactMarkdown> // Render full content as markdown
        )}
      </div>
      {/* Button to toggle content expansion */}
      <button
        className={styles.toggleButton}
        onClick={toggleExpanded} // Call toggleExpanded when clicked
        aria-expanded={isExpanded} //Aria label for accessibility
      >
        {isExpanded ? "Read Less" : "Read More"} 
      </button>
      {!isPreview && ( //Show like button, comments and social share icons if it's not a preview
        <>
          <LikeButton postId={id} initialLikes={0} isDarkMode={isDarkMode} />{" "}
          {/*Like button for the post*/}
          <CommentSection postId={id} /> {/*Comment section for the post*/}
          <div className={styles.socialShare}>
            {" "}
            {/*Social media sharing icons*/}
            <a //Link to share on WhatsApp
              href="https://www.whatsapp.com"
              target="_blank" //Open link in a new tab
              rel="noopener noreferrer" //Security measure for external links
              aria-label="Share on WhatsApp" //Accessibility label
            >
              <FaWhatsapp className={styles.shareIcon} /> {/*WhatsApp icon*/}
            </a>
            <a //Link to share on LinkedIn
              href="https://in.linkedin.com"
              target="_blank" //Open link in a new tab
              rel="noopener noreferrer" //Security measure for external links
              aria-label="Share on LinkedIn" //Accessibility label
            >
              <FaLinkedin className={styles.shareIcon} /> {/*LinkedIn icon*/}
            </a>
            <a //Link to Instagram
              href="https://www.instagram.com"
              target="_blank" //Open in new tab
              rel="noopener noreferrer" //noopener noreferrer for security
              aria-label="Visit Instagram" //aria label for accessibility
            >
              <FaInstagram className={styles.shareIcon} /> {/*Instagram Icon*/}
            </a>
          </div>
        </>
      )}
    </article>
  );
} //End of BlogPost Component

// PropTypes for type checking the component's props
BlogPost.propTypes = {
  id: PropTypes.number.isRequired, //id is required and must be a number
  title: PropTypes.string.isRequired, // title is required and must be a string
  content: PropTypes.string.isRequired, // content is required and must be a string
  author: PropTypes.string.isRequired, //author is required and must be a string
  date: PropTypes.string.isRequired, //date is required and must be a string
  image: PropTypes.string, //image is optional and can be a string
  isDarkMode: PropTypes.bool.isRequired, //isDarkMode is required and must be a boolean
  isPreview: PropTypes.bool, //isPreview is optional and can be a boolean
  searchTerm: PropTypes.string, //searchTerm is optional and can be a string
};

export default BlogPost; //Export the component for use in other parts of the application
