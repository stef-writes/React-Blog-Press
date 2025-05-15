# API Documentation - Blog Service (Day 3)

This document covers the API endpoints related to Day 3 functionality: Comment Management for Blog Posts.

## Endpoints

### 1. Get Comments for a Post

*   **Endpoint:** `GET /api/posts/:id/comments`
*   **Description:** Retrieves all comments for a specific blog post.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to get comments for (required).
*   **Responses:**
    *   `200 OK`: Returns an array of comment objects
        ```json
        [
          {
            "_id": "commentId",
            "content": "Comment text",
            "author": {
              "_id": "userId",
              "name": "User Name",
              "email": "user@example.com"
            },
            "post": "postId",
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
          },
          // More comments...
        ]
        ```
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `500 Internal Server Error`: If there's a server-side issue.

### 2. Add a Comment to a Post

*   **Endpoint:** `POST /api/posts/:id/comments`
*   **Description:** Adds a new comment to a specific blog post.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to comment on (required).
*   **Request Body:**
    ```json
    {
      "content": "string (required)"
    }
    ```
*   **Responses:**
    *   `201 Created`: Returns the created comment object
        ```json
        {
          "_id": "commentId",
          "content": "Comment text",
          "author": {
            "_id": "userId",
            "name": "User Name",
            "email": "user@example.com"
          },
          "post": "postId",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
        ```
    *   `400 Bad Request`: If validation fails.
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `404 Not Found`: If the post with the given ID does not exist.
    *   `500 Internal Server Error`: If there's a server-side issue.

### 3. Update a Comment

*   **Endpoint:** `PUT /api/posts/:id/comments/:commentId`
*   **Description:** Updates an existing comment. Only the author of the comment can update it.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post containing the comment (required).
    *   `commentId`: The ID of the comment to update (required).
*   **Request Body:**
    ```json
    {
      "content": "string (required)"
    }
    ```
*   **Responses:**
    *   `200 OK`: Returns the updated comment object
        ```json
        {
          "_id": "commentId",
          "content": "Updated comment text",
          "author": {
            "_id": "userId",
            "name": "User Name",
            "email": "user@example.com"
          },
          "post": "postId",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
        ```
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `403 Forbidden`: If the authenticated user is not the author of the comment.
    *   `404 Not Found`: If the comment with the given ID does not exist.
    *   `500 Internal Server Error`: If there's a server-side issue.

### 4. Delete a Comment

*   **Endpoint:** `DELETE /api/posts/:id/comments/:commentId`
*   **Description:** Deletes a specific comment. Only the author of the comment can delete it.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post containing the comment (required).
    *   `commentId`: The ID of the comment to delete (required).
*   **Responses:**
    *   `200 OK`:
        ```json
        {
          "message": "Comment deleted successfully"
        }
        ```
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `403 Forbidden`: If the authenticated user is not the author of the comment.
    *   `404 Not Found`: If the comment with the given ID does not exist.
    *   `500 Internal Server Error`: If there's a server-side issue. 