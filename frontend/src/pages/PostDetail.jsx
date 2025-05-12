import { useState, useEffect } from "react"; // Import necessary React hooks for managing state and side effects.
import BlogPost from "../components/BlogPost/BlogPost"; // Import BlogPost component.
import { useParams, useNavigate } from "react-router-dom"; // Import hooks for interacting with routing.
import styles from "./Home.module.css"; // Import CSS modules for styling.

function PostDetail() {
  const { id } = useParams(); // Extract the post ID from the URL parameters.
  const [post, setPost] = useState(null); // State variable for storing the post to be displayed. Initialized to null.
  const [loading, setLoading] = useState(true); // State for loading indicator.
  const [error, setError] = useState(null); // State for error messages.
  const navigate = useNavigate(); // Hook for programmatic navigation.

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");
        if (!token) {
          alert("Authentication token not found. Please log in.");
          navigate("/");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the post.");
        }

        const data = await response.json();

        // Transform the API response to match BlogPost props
        const transformedPost = {
          id: data._id,
          title: data.title,
          content: data.content,
          author: data.author,
          tags: data.tags.map((tag) => tag.name),
          categories: data.categories.map((category) => category.name),
          date: new Date(data.createdAt).toLocaleDateString(),
          image: null, // Adjust if the API supports image URLs
          likeCount: data.likeCount || 0,
        };

        setPost(transformedPost);
      } catch (err) {
        setError(err.message);
        alert("Post not found or an error occurred.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) return <p>Loading...</p>; // Show loading indicator while fetching data
  if (error) return <p>{error}</p>; // Display error message if there's an error

  return (
    <div className={styles.home}> {/* Main container for the post detail page */}
      <main className={styles.mainContent}> {/* Main content area */}
        {post && (
          <BlogPost // Render the BlogPost component with the fetched post data
            key={post.id} // Key prop for efficient rendering updates
            id={post.id} // Pass the post ID
            title={post.title} // Pass the post title
            content={post.content} // Pass the post content
            author={post.author} // Pass the post author
            date={post.date} // Pass the post date
            image={post.image} // Pass the post image
            isDarkMode={false} // Set isDarkMode to false
            isPreview={false} // Set isPreview to false
          />
        )}
      </main>
    </div>
  );
}

export default PostDetail; // Export the PostDetail component as the default export.
