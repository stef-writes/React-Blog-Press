// src/pages/NewPost.jsx
// Import necessary hooks from React library
import { useState, useEffect } from "react";
// Import the PostEditor component for creating/editing posts
import PostEditor from "../components/PostEditor/PostEditor";

// Define the NewPost functional component
function NewPost() {
    // Initialize the post state with useState, initially set to null
    const [post, setPost] = useState(null);

    // Use the useEffect hook to load a saved draft from localStorage when the component mounts
    useEffect(() => {
        // Retrieve the saved draft from localStorage and parse it as JSON
        const savedDraft = JSON.parse(localStorage.getItem("postDraft"));
        // If a saved draft exists, update the post state with the draft
        if (savedDraft) {
            setPost(savedDraft);
        }
    // Specify an empty dependency array for the useEffect to run only once on mount
    }, []);

    // Render the PostEditor component, passing the post state and dark mode setting as props    
    return <PostEditor post={post} isDarkMode={false} />;
}

// Export the NewPost component as the default export
export default NewPost;
