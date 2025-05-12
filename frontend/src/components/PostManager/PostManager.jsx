// Import necessary hooks from React library for managing state and side effects
import { useState, useEffect } from "react";
// Import CSS styles for the component from the corresponding CSS module file
import styles from "./PostManager.module.css";

// Define the PostManager functional component
function PostManager() {
  // Initialize state variables using the useState hook
  const [posts, setPosts] = useState([]); // Stores the fetched posts
  const [loading, setLoading] = useState(false); // Tracks whether posts are currently being fetched
  const [currentPage, setCurrentPage] = useState(1); // Stores the current page number for pagination
  const [totalPages, setTotalPages] = useState(1); // Stores the total number of pages available
  const [isEditing, setIsEditing] = useState(false); // Tracks whether the edit form should be displayed
  const [editPostId, setEditPostId] = useState(null); // Stores the ID of the post being edited
  const [editPostTitle, setEditPostTitle] = useState(""); // Stores the updated title of the post being edited
  // input field value for editing
  const [editPostContent, setEditPostContent] = useState(""); // Stores the updated content of the post being edited
  // text area value for editing

  // Function to fetch posts from the API with pagination
  const fetchPosts = async (page) => {
    setLoading(true); // Set loading state to true while fetching
    try {
      // Retrieve authentication token from local storage
      const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");

      // Check if token exists, if not alert user and return
      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      // Construct the API URL with pagination parameters
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/posts?page=${page}&results_per_page=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );

      // Check if response is not ok, if so throw error
      if (!response.ok) {
        throw new Error("Failed to fetch posts.");
      }

      // Parse response data as JSON
      const data = await response.json();

      // Transform the fetched posts to include only necessary data
      const transformedPosts = data.posts.map((post) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author, // Include author information
      }));

      // Update state with fetched and transformed posts and total pages
      setPosts(transformedPosts);
      setTotalPages(data.totalPages);
    } catch (error) {
      // Log and display error message if fetching fails
      console.error("Error fetching posts:", error);
      alert(error.message || "An error occurred while fetching posts.");
    } finally {
      setLoading(false); // Set loading state to false after fetching completes, regardless of success or failure
    }
  };

  // Function to handle deleting a post
  const handleDeletePost = async (postId, postAuthor) => {
    try {
      // Get token and current user ID from local storage
      const { token, id: currentUserId } = JSON.parse(
        localStorage.getItem("auth_user") || "{}"
      );
      // optional chaining ?. prevents errors if localStorage value is null

      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      // Check if current user is authorized to delete the post (only author can delete)
      if (currentUserId !== postAuthor) {
        alert("You are not authorized to delete this post.");
        return;
      }

      // Send DELETE request to the API to delete the post
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the post.");
      }

      // Alert user upon successful deletion and refetch posts to update the UI
      alert("Post deleted successfully.");
      fetchPosts(currentPage);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message || "An error occurred while deleting the post.");
    }
  };

  // Function to handle starting the editing process for a post
  const startEditing = (post) => {
    const { id: currentUserId } = JSON.parse(
      localStorage.getItem("auth_user") || "{}"
    );

    if (currentUserId !== post.author) {
      alert("You are not authorized to edit this post.");
      return;
    }

    setIsEditing(true); // Set isEditing state to true to display the edit form
    setEditPostId(post.id); // Set the ID of the post being edited
    setEditPostTitle(post.title); // Set the initial title for editing
    setEditPostContent(post.content); // Set the initial content for editing
  };

  // Function to handle updating an existing post
  const handleUpdatePost = async () => {
    try {
      // Get token and user ID from local storage
      const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");

      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      // Send PUT request to the API to update the post
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${editPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Indicate that the request body is JSON
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          body: JSON.stringify({
            // convert updated title and content to a JSON string
            title: editPostTitle,
            content: editPostContent,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // parse error data from response
        throw new Error(errorData.message || "Failed to update the post."); // throw error with message from server or default
      }

      // If update successful, log success message, alert user, hide the edit form, and refetch posts
      const data = await response.json();
      console.log("Post updated successfully:", data);

      alert("Post updated successfully.");
      setIsEditing(false);
      fetchPosts(currentPage);
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error.message || "An error occurred while updating the post.");
    }
  };

  // Use useEffect hook to fetch posts when the component mounts and whenever currentPage changes
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  // Function to handle navigating to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1); // uses functional form of setState to update based on previous value. avoids potential race conditions.
    }
  };

  // Function to handle navigating to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Return the JSX to render the component
  return (
    <div className={styles.postManager}>
      <h2>Post Manager</h2>

      {/* Conditionally render loading message or post list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className={styles.postList}>
          {/* Render post items if posts exist, otherwise display a message */}
          {posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.id} className={styles.postItem}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                {/* Buttons for editing and deleting posts */}
                <button
                  className={styles.edit}
                  onClick={() => startEditing(post)} // when clicked starts editing this post
                >
                  Edit
                </button>
                <button
                  className={styles.delete}
                  onClick={() => handleDeletePost(post.id, post.author)}
                  // passes both postId and postAuthor to the delete handler
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </ul>
      )}

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1} // Disable "Previous" button on the first page
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages} // Disable "Next" button on the last page
        >
          Next
        </button>
      </div>

      {/* Edit Form - displayed when isEditing is true */}
      {isEditing && (
        <div className={styles.editForm}>
          <h2>Edit Post</h2>
          {/* Input fields for editing post title and content */}
          <input
            type="text"
            value={editPostTitle}
            onChange={(e) => setEditPostTitle(e.target.value)}
            placeholder="Edit post title"
          />
          <textarea
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            placeholder="Edit post content"
          ></textarea>
          {/* Button to submit the updated post */}
          <button onClick={handleUpdatePost}>Update Post</button>
          {/* Button to cancel editing */}
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// Export the PostManager component as the default export
export default PostManager;
