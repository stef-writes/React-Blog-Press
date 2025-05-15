/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment"; // Import moment.js for date formatting
import styles from "./CommentSection.module.css";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]); // State to store fetched comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [editComment, setEditComment] = useState(null); // State for the comment being edited
  const [hideComment, setHideComment] = useState(false); // Toggle visibility of comments
  const [sortOption, setSortOption] = useState("newest"); // Sorting option for comments
  const [loading, setLoading] = useState(false); // Loading state for form submission

  // useEffect hook to fetch and display comments for a specific post.  The dependency array [postId] ensures this runs whenever the postId changes  This hook is used to perform side effects in functional components, such as fetching data, subscribing to events, or manually changing the DOM.
  useEffect(() => {
    // Define an asynchronous function to fetch comments from the API.  Asynchronous functions allow you to work with promises and await their resolution.  This makes asynchronous code easier to read and reason about.
    const fetchComments = async () => {
      try {
        setLoading(true);
        const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");
        
        if (!token) {
          console.error("Authentication token not found");
          return;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }
        
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetchComments function to initiate the comment fetching process.
    if (postId) {
      fetchComments();
    }
    // Specify the postId as a dependency for the useEffect hook. This ensures that the effect runs whenever the postId changes.  If the postId changes, the component needs to fetch the comments for the new post
  }, [postId]);

  // Function to handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      setLoading(true);
      const { token, user } = JSON.parse(localStorage.getItem("auth_user") || "{}");
      
      if (!token) {
        alert("Please log in to comment");
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.status}`);
      }
      
      const newCommentData = await response.json();
      setComments(prevComments => [newCommentData, ...prevComments]);
      setNewComment(""); // Clear input field
      
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle editing an existing comment
  const handleEditComment = (comment) => {
    // Set the comment to be edited in the state.  This will trigger the edit mode in the component
    setEditComment(comment);
    // Populate the input field with the content of the comment to be edited.
    setNewComment(comment.content);
  };

  // Function to handle updating an existing comment
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !editComment) return;
    
    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");
      
      if (!token) {
        alert("Please log in to update your comment");
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments/${editComment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update comment: ${response.status}`);
      }
      
      const updatedComment = await response.json();
      
      // Update the comment in the state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
      
      // Clear edit state
      setEditComment(null);
      setNewComment("");
      
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a comment
  const handleDeleteComment = async (commentId, commentAuthorId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      const { token, user } = JSON.parse(localStorage.getItem("auth_user") || "{}");
      
      if (!token) {
        alert("Please log in to delete a comment");
        return;
      }
      
      // Check if user is authorized (either comment author or post owner)
      if (user && user.id !== commentAuthorId.toString()) {
        alert("You can only delete your own comments");
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status}`);
      }
      
      // Remove the deleted comment from state
      setComments(prevComments => 
        prevComments.filter(comment => comment._id !== commentId)
      );
      
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  // Function to toggle the visibility of the comments section
  const toggleShowComments = () => {
    //sets the hideComment state to the opposite of its current value. This is a common way to toggle a boolean value.
    setHideComment(!hideComment);
  };

  // Function to render the comments section. This function takes the comments data from the component's state, sorts them according to the selected sort option, and then maps each comment to a JSX element for display.
  const renderComments = () => {
    // Create a copy of the comments array using the spread operator to avoid modifying the original state directly.  This is because sort mutates the original array
    const sortedComments = [...comments].sort((a, b) => {
      // Sort comments by creation date (newest or oldest)
      if (sortOption === "newest") {
        // Compare the createdAt timestamps of two comments (b - a for descending order - newest first) and converts them to date objects before comparison
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "oldest") {
        //Compare timestamps in ascending order to sort from oldest to newest
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0; // Don't sort if sortOption is not "newest" or "oldest"
    });

    return sortedComments.map(
      (
        comment // Map over the sorted comments array and render each comment
      ) => (
        <div key={comment._id} className={styles.comment}>
          {" "}
          {/* Container for each comment  */}
          <p>{comment.content}</p> {/* Display the comment content */}
          {/* Display the timestamp of when the comment was created in a specific format */}
          <span className={styles.comment__timestamp}>
            {moment(comment.createdAt).format("Do MMM YYYY HH:mm:ss")}
          </span>
          {/* Button to edit the comment */}
          <button onClick={() => handleEditComment(comment)}>Edit</button>
          {/* Button to delete the comment */}
          <button
            onClick={() => handleDeleteComment(comment._id, comment.author)} // Pass comment ID and author ID for authorization
          >
            Delete
          </button>
        </div>
      )
    );
  };


  // Return the JSX to render the comment section component
  return (
    <div className={styles.commentSection}>
      {" "}
      {/* Main container for the comment section */}
      <h3>
        {" "}
        {/* Heading that changes based on whether the user is editing a comment or adding a new one */}
        {editComment ? "Edit your comment" : "Leave a comment"}
      </h3>
      {/* Form for adding or updating a comment */}
      <form onSubmit={editComment ? handleUpdateComment : handleAddComment}>
        {" "}
        {/* Determine which function to call on submit based on editComment state */}
        <div className={styles.textareaContainer}>
          {" "}
          {/* Container for the textarea */}
          <textarea
            value={newComment} // Bind the value to the newComment state
            onChange={(e) => setNewComment(e.target.value)} // Update newComment state when input changes
            placeholder={
              // Dynamic placeholder text
              editComment ? "Update your comment..." : "Write a comment..."
            }
            className={styles.commentForm__input}
            rows="3" //Set the number of rows for the textarea
            disabled={loading} //Disable textarea while loading
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || loading} // Disable if comment is empty or loading
          className={styles.commentForm__submit}
        >
          {/* Dynamic button text based on loading and edit state */}
          {loading
            ? "Processing..." // Display loading text while submitting
            : editComment
            ? "Update Comment"
            : "Comment"}
        </button>
        {/* Cancel button for editing a comment */}
        {editComment && ( // Conditionally render the Cancel button only in edit mode
          <button
            type="button" //important to set to button so that the form isn't submitted
            onClick={() => {
              // Clear edit state and reset input field when clicked
              setEditComment(null);
              setNewComment("");
            }}
            className={styles.cancelEditBtn}
          >
            Cancel
          </button>
        )}
      </form>
      <div className={styles.sortOptions}>
        {" "}
        {/*Container for comment sorting options*/}
        <label>Sort by: </label> {/*Label for the select dropdown*/}
        <select
          value={sortOption} // Bind selected value to sortOption state
          onChange={(e) => setSortOption(e.target.value)} // Update sortOption on change
        >
          <option value="newest">Newest</option>{" "}
          {/* Option to sort by newest comments */}
          <option value="oldest">Oldest</option>{" "}
          {/* Option to sort by oldest comments */}
        </select>
      </div>
      {/* Button to show/hide comments */}
      <button onClick={toggleShowComments} className={styles.toggleCommentsBtn}>
        {" "}
        {/* Button to toggle comment visibility */}
        {hideComment ? "Show comments" : "Hide comments"}{" "}
        {/* Toggle button text */}
      </button>
      {/* Conditionally render the comments list */}
      {!hideComment && ( // Only render comments if hideComment is false
        <div className={styles.commentsList}>{renderComments()}</div> // Render the comments using the renderComments function
      )}
    </div>
  );
}

// PropTypes for type checking the component's props
CommentSection.propTypes = {
  postId: PropTypes.string.isRequired, // postId is required and must be a string
};

// Export the CommentSection component as the default export
export default CommentSection;
