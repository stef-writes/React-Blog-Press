
Okay, let's break down the requirements for Day 2: **Delete Post Functionality**, based on the `post-feature-guide.md`.

## Day 2 Plan: Delete Post Functionality

**Overall Objective:** Implement the ability for an authenticated user to delete their own blog posts. This involves backend logic to remove the post and its associated data (likes, comments) and frontend logic to trigger the deletion and update the UI.

---

### I. Backend Implementation (`blog-service`)

**A. Implement the `deletePost` Function**

*   **File to Edit:** `backend/blog-service/controllers/postController.js`
*   **Function Signature (Expected):** `exports.deletePost = async (req, res) => { ... }`
*   **Detailed Steps & Requirements:**
    1.  **Find Post by ID:**
        *   Use `Post.findById(req.params.id)` to retrieve the post.
        *   **Requirement:** If the post is not found, respond with a `404 Not Found` status and a JSON message (e.g., `{ "message": "Post not found" }`).
    2.  **Verify User Authorization:**
        *   Compare the `author` field of the found post (e.g., `post.author.toString()`) with the authenticated user's ID (`req.user.id`).
        *   **Requirement:** If the IDs do not match, respond with a `403 Forbidden` status and a JSON message (e.g., `{ "message": "Not authorized to delete this post" }`).
    3.  **Remove Associated Data:**
        *   **Requirement:** Before deleting the post, delete all associated likes. Use `Like.deleteMany({ post: req.params.id })`.
        *   **Requirement:** Delete all associated comments. Use `Comment.deleteMany({ post: req.params.id })`.
    4.  **Delete the Post:**
        *   **Requirement:** Use the `post.deleteOne()` method (if you fetched the post document) or `Post.findByIdAndDelete(req.params.id)`.
    5.  **Clean Up Orphaned Tags and Categories (Optional but Recommended by Guide):**
        *   The guide mentions calling `cleanUpTags` and `cleanUpCategories`. These utility functions (presumably already existing or to be created in `utils/cleanup.js`) would remove any tags or categories that are no longer associated with any posts after this deletion.
        *   **Requirement (if implementing):** Ensure these functions are called *after* the post is successfully deleted.
    6.  **Success Response:**
        *   **Requirement:** Respond with a `200 OK` status and a JSON success message (e.g., `{ "message": "Post and associated data deleted successfully" }`).
    7.  **Error Handling:**
        *   **Requirement:** Wrap the entire logic in a `try...catch` block.
        *   **Requirement:** In case of any unexpected errors, respond with a `500 Internal Server Error` status and a JSON message detailing the error (e.g., `{ "message": "Failed to delete post", "error": error.message }`).
        *   **Requirement:** Use `logger` for errors.

**B. Implement the Posts Router for Delete Functionality**

*   **File to Edit:** `backend/blog-service/routes/postRoutes.js`
*   **Detailed Steps & Requirements:**
    1.  **Import `deletePost` Function:**
        *   Add `deletePost` to the destructured import from `../controllers/postController`.
    2.  **Add `DELETE` Route:**
        *   **Requirement:** Define a new route: `router.delete("/:id", protect, deletePost);`.
        *   This route should handle `DELETE` requests to `/api/posts/:id`.
        *   It must use the `protect` middleware to ensure the user is authenticated.

**Checkpoint 1: Backend Complete**
*   `deletePost` function fully implemented in `postController.js`.
*   `DELETE /api/posts/:id` route added to `postRoutes.js`.
*   (Self-review) All requirements for error handling, authorization, and data removal met.

---

### II. Frontend Implementation

**A. Implement `handleDelete` Function in `BlogPost` Component**

*   **File to Edit:** `frontend/src/components/BlogPost/BlogPost.jsx` (or potentially where the delete button for a post resides, if not directly in `BlogPost.jsx` - the guide specifies `BlogPost.jsx`).
*   **Function to Create/Modify:** `handleDelete` (likely an async function).
*   **Detailed Steps & Requirements:**
    1.  **Retrieve User Authentication Information:**
        *   Get the stored user information string from `localStorage.getItem("auth_user")`.
        *   Parse this string using `JSON.parse()`. Handle potential `null` values from `localStorage` gracefully (e.g., `JSON.parse(localStorage.getItem("auth_user") || "{}")`).
        *   Extract the `token` and the current user's ID (e.g., `currentUserId = authUser.id`).
    2.  **Check for User Authentication:**
        *   **Requirement:** If no `token` is found, display an alert to the user (e.g., "Authentication token not found. Please log in.") and stop further execution (return early).
    3.  **Verify User Authorization:**
        *   **Requirement:** Compare the `author` ID of the post being deleted with `currentUserId`.
        *   **Requirement:** If they do not match, display an alert (e.g., "You are restricted to delete this post, as you are not the owner.") and stop further execution.
    4.  **Send `DELETE` Request:**
        *   Construct the API URL: `${import.meta.env.VITE_API_URL}/api/posts/${id}` (where `id` is the ID of the post to delete).
        *   **Requirement:** Use the `fetch` API to send a `DELETE` request to this URL.
        *   **Requirement:** Include the `Authorization` header: `Authorization: Bearer ${token}`.
        *   Await the server's response.
    5.  **Handle API Response:**
        *   **Requirement:** Check if `response.ok` is true.
        *   If not successful (`!response.ok`), throw a new error (e.g., `throw new Error("Failed to delete the post. Please try again.");`).
        *   **Requirement:** If successful, display an alert to the user (e.g., "Post deleted successfully!").
    6.  **Redirect or Update UI:**
        *   The guide suggests redirecting to the home page: `navigate("/")`.
        *   **Requirement:** This navigation should only happen after a successful deletion.
        *   Alternatively, if on a list page, you might want to update the local state to remove the post from the list.
    7.  **Handle Errors:**
        *   **Requirement:** Wrap the `fetch` call and response handling in a `try...catch` block.
        *   In the `catch` block, display the error message to the user using `alert(error.message)`.
        *   Consider logging the full error to the console for debugging (`console.error("Error deleting post:", error);`).
    8.  **UI Element:** Ensure there's a "Delete" button associated with each post (for the author) that calls this `handleDelete` function.

**Checkpoint 2: Frontend Complete**
*   `handleDelete` function implemented in the relevant frontend component.
*   Delete button correctly calls `handleDelete`.
*   UI updates correctly after deletion (e.g., redirect or list update).
*   All alert messages and error handling are in place.

---

### III. Testing Guide

**A. Backend Testing (Jest & Supertest)**

*   **File to Create/Edit:** `backend/blog-service/tests/day2testing.test.js` (or add to existing post test file if preferred, but a new file for Day 2 is clearer).
*   **Setup:**
    *   Similar setup as Day 1 tests (in-memory MongoDB, mock `authMiddleware`, mock logger).
    *   In `beforeEach`, create one or two posts: one by `userA` and optionally one by `userB`. Also create associated likes and comments for one of these posts to test their deletion.
*   **Test Scenarios for `DELETE /api/posts/:id`:**
    1.  **Successful Deletion:**
        *   User A deletes their own post.
        *   Assert `200 OK` status.
        *   Assert success message.
        *   Verify the post is actually deleted from the database.
        *   Verify associated likes and comments for that post are also deleted.
    2.  **Unauthorized Deletion Attempt:**
        *   User B tries to delete User A's post.
        *   Assert `403 Forbidden` status.
        *   Verify the post still exists in the database.
    3.  **Deleting a Non-Existent Post:**
        *   Attempt to delete a post with a valid but non-existent ID.
        *   Assert `404 Not Found` status.
    4.  **Attempt to Delete Without Authentication:**
        *   Send request without an `Authorization` header (or with an invalid token, if your mock supports it).
        *   Assert `401 Unauthorized` status.

**B. Frontend Manual Testing (UI)**

1.  **Log in as a user.**
2.  **Create a new post.** Add some likes and comments to it (once those features are available, or mock their existence for now if focusing purely on delete).
3.  **Verify Delete Button Visibility:**
    *   The delete button should be visible on posts owned by the logged-in user.
    *   The delete button should *not* be visible (or should be disabled) on posts owned by other users.
4.  **Successful Deletion:**
    *   Click the delete button on your own post.
    *   Confirm any confirmation dialogs (if implemented).
    *   Verify the success alert ("Post deleted successfully!").
    *   Verify the post is removed from the UI (e.g., from the list, or you are redirected).
    *   Verify the post is actually gone from the backend (e.g., by refreshing the page or checking the database if possible).
5.  **Attempt to Delete Another User's Post:**
    *   If possible, log in as a different user.
    *   Try to find a way to trigger deletion of the first user's post (e.g., if the button was mistakenly shown, or by trying to craft a request). The UI should prevent this, and the backend should definitely return a 403.
6.  **Error Handling:**
    *   Simulate a server error (if possible by temporarily stopping the backend) and check if the frontend shows an appropriate error alert.

**C. Postman Testing (Optional but good for direct API check)**

1.  **Create a Post:** Use your existing "Create Post" request. Note its ID.
2.  **(If Likes/Comments exist) Create Likes/Comments:** Use Postman to add likes/comments to this post.
3.  **Delete Post (Success):**
    *   Request: `DELETE {{GATEWAY_URL}}/api/posts/{{CREATED_POST_ID}}`
    *   Authorization: `Bearer {{AUTH_TOKEN}}` (as the post owner)
    *   Expected: `200 OK` with success message.
4.  **Verify Deletion:** Try to fetch the deleted post ID (`GET {{GATEWAY_URL}}/api/posts/{{CREATED_POST_ID}}`); expect a `404 Not Found`.
5.  **Delete Post (Unauthorized):**
    *   Create a post as User A.
    *   Try to delete it using User B's token.
    *   Expected: `403 Forbidden`.

---

This detailed plan should guide you through the implementation and testing of the Day 2 "Delete Post Functionality." We'll start with the backend controller. Ready to begin?
