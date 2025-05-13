// Import necessary hooks from React library
import { useState, useEffect } from "react";
// Import useParams to access route parameters and useNavigate for navigation
import { useParams, useNavigate } from "react-router-dom";
// Import the PostEditor component for editing posts
import PostEditor from "../components/PostEditor/PostEditor";
// Import the useBlog hook to access blog context (state and dispatch)
import { useBlog } from "../contexts/BlogContext";

// Define the EditPost functional component
function EditPost() {
  // Get the post ID from the URL using useParams hook
  const { id } = useParams();
  // Access the blog context using useBlog hook
  const { state, dispatch } = useBlog();
  // Destructure posts from the blog context state
  const { posts } = state;
  // Initialize state variables using useState hook
  const [post, setPost] = useState(null); // Stores the post to be edited
  const [error, setError] = useState(null); // Stores any error messages
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [isRestricted, setIsRestricted] = useState(false); // Flags whether the user is restricted from editing
  // Get the navigate function for programmatic navigation
  const navigate = useNavigate();

  // useEffect hook to fetch the post data when the component mounts or when the 'id', 'navigate', 'posts', or 'dispatch' values change.
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
        const token = authUser.token;
        const currentUserId = authUser.id;

        if (!token) {
          alert("Authentication token not found. Please log in.");
          navigate("/login");
          return;
        }

        // First try to get the post from the API
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/posts/${id}`,
            {
              headers: {
              Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch the post.");
          }

        const data = await response.json();

        // Check if the fetched post's author matches the current user's ID
          if (data.author !== currentUserId) {
            setIsRestricted(true);
            return;
          }

        // Transform the fetched post data
          const transformedPost = {
            id: data._id,
            title: data.title,
            content: data.content,
            author: data.author,
            tags: data.tags.map((tag) => tag.name),
          category: data.categories[0]?.name || "general",
          date: new Date(data.createdAt).toLocaleDateString(),
          image: null,
          };

        setPost(transformedPost);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
        navigate("/posts");
      }
    };

    fetchPost();
  }, [id, navigate]);

  // useEffect hook to handle restricted users. This effect runs whenever the value of isRestricted changes.
  useEffect(() => {
    if (isRestricted) {
      // If the user is restricted, display an alert and redirect to the /posts page.
      alert("You are restricted to edit this post, as you are not the owner.");
      navigate("/posts");
    }
    // Dependency array to re-run this effect when `isRestricted` or `navigate` changes
  }, [isRestricted, navigate]);

  // Conditionally render loading message, error message, or PostEditor component
  if (loading) return <p>Loading...</p>; // Display loading message while loading
  if (error) return <p>{error}</p>; // Display error message if an error occurred

  // if post exists render the PostEditor, otherwise show a loading message. Optional chaining (?.) is used to safely access the post object in case it's still null.
  return post ? (
    <PostEditor post={post} isDarkMode={false} />
  ) : (
    <p>Loading post...</p>
  );
}

// Export the EditPost component as the default export
export default EditPost;
