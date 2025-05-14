# Day 2 API Documentation: Delete Post

This document provides details about the API endpoint implemented for deleting a blog post.

## Endpoint: Delete a Post

Deletes a specific blog post, along with its associated data (likes, comments), and cleans up any orphaned tags or categories.

-   **URL:** `/api/posts/:id`
-   **Method:** `DELETE`
-   **Authentication:** Required (Bearer Token)
    -   The user must be authenticated and must be the author of the post to delete it.

### Path Parameters

-   `id` (string, required): The ID of the blog post to be deleted.
    -   Example: `/api/posts/60d21b4667d0d8992e610c85`

### Request Headers

-   `Authorization`: `Bearer <JWT_TOKEN>`
    -   Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Request Body

-   None

### Responses

#### Success Response

-   **Code:** `200 OK`
-   **Content:**
    ```json
    {
        "message": "Post and associated data deleted successfully"
    }
    ```

#### Error Responses

-   **Code:** `403 Forbidden`
    -   **Condition:** The authenticated user is not the author of the post.
    -   **Content:**
        ```json
        {
            "message": "Not authorized to delete this post"
        }
        ```

-   **Code:** `404 Not Found`
    -   **Condition:** The post with the specified `id` does not exist.
    -   **Content:**
        ```json
        {
            "message": "Post not found"
        }
        ```

-   **Code:** `401 Unauthorized` (Handled by `protect` middleware)
    -   **Condition:** No token provided, or token is invalid.
    -   **Content (Example from typical JWT middleware):**
        ```json
        {
            "message": "Not authorized, no token" 
        }
        ```
        *(Note: The exact message for 401 might vary based on the `authMiddleware` implementation. The plan specified "Not authorized, no token" / "Token is not valid" as potential messages from `protect`)*

-   **Code:** `500 Internal Server Error`
    -   **Condition:** An unexpected error occurred on the server during the deletion process.
    -   **Content:**
        ```json
        {
            "message": "Failed to delete post",
            "error": "<error_details>"
        }
        ```

