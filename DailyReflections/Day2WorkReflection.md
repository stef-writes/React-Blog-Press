# Day 2 Work Reflection: Implementing "Delete Post" Functionality

## Overview
Day 2 focused on implementing and testing the "Delete Post" feature, building upon the existing full-stack blog application. This involved backend API development, frontend integration, and comprehensive testing using both manual UI checks and Postman for API endpoint verification.

## Key Activities & Accomplishments:

1.  **Backend Implementation (`blog-service`):**
    *   **`deletePost` Controller (`postController.js`):**
        *   Implemented logic to find a post by ID.
        *   Added authorization checks to ensure only the post's author can delete it.
        *   Ensured the deletion of the main post document.
        *   Implemented cascading deletion for associated data:
            *   Removed all `Like` documents linked to the post.
            *   Removed all `Comment` documents linked to the post.
        *   Added logic to clean up `Tag` and `Category` documents if they become orphaned (no longer associated with any posts) after a post deletion.
    *   **API Route (`postRoutes.js`):**
        *   Added a `DELETE /api/posts/:id` route, protected by authentication middleware and using the `deletePost` controller.

2.  **Frontend Implementation (`frontend`):**
    *   **`BlogPost.jsx`:**
        *   Implemented an `handleDelete` asynchronous function to send a `DELETE` request to the backend API endpoint when a delete button is clicked.
        *   Ensured the `Authorization` header with the JWT token was included in the request.
        *   Added logic to update the UI upon successful deletion (e.g., by refetching the post list or removing the post from the local state).
    *   **UI Element:**
        *   Added a "Delete" button to individual blog post displays, visible only to the post author.

3.  **Testing & Verification:**
    *   **Manual UI Testing:**
        *   Successfully performed a manual test by logging in, creating a post, and then deleting it through the UI. Confirmed the post was removed from the view.
    *   **Postman API Testing (End-to-End):**
        *   Set up and executed requests against the live API Gateway:
            *   **Successful Deletion:** Created a `DELETE` request to `{{GATEWAY_URL}}/api/posts/{{CREATED_POST_ID}}`.
                *   Used `{{AUTH_TOKEN}}` for authorization.
                *   Verified a `200 OK` response and the success message from the backend.
            *   **Verification of Deletion (404):** Created a `GET` request to `{{GATEWAY_URL}}/api/posts/{{CREATED_POST_ID}}` (after deletion).
                *   Verified a `404 Not Found` response, confirming the post was no longer accessible via the API.
    *   **Testing Strategy Discussion:**
        *   Clarified the distinct roles of Jest/Supertest (for backend unit/integration tests) and Postman (for API/end-to-end tests).
    *   **Planning for Backend Tests (Jest/Supertest):**
        *   Outlined detailed test requirements for the `deletePost` controller, including:
            *   Successful deletion by the author (and cleanup of associated data/tags/categories).
            *   Attempted deletion by a non-author (expecting 403 Forbidden).
            *   Attempted deletion of a non-existent post (expecting 404 Not Found).
            *   Attempted deletion with an invalid post ID format (expecting 400/404).

4.  **Version Control (Git & GitHub):**
    *   Staged all modified and new files.
    *   Committed changes to the local `Day2` branch with a descriptive message.
    *   Pushed the `Day2` branch to the remote GitHub repository and set the upstream tracking branch.

## Next Steps:
*   Implement the comprehensive backend tests for the `deletePost` controller using Jest and Supertest as outlined.
