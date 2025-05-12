// Imports the PostManager component, which is assumed to handle the management of blog posts.
import PostManager from "../components/PostManager/PostManager";

// Defines the functional component PostManagerPage.
function PostManagerPage() {
  // Returns a simple div containing the PostManager component.  This component likely provides an interface for managing blog posts (creating, editing, deleting).
  return (
    <div>
      <PostManager />
    </div>
  );
}

// Exports the PostManagerPage component as the default export, making it available for use in other parts of the application.  This allows other modules to import and use this component.
export default PostManagerPage;
