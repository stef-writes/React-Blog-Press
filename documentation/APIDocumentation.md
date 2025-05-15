# Complete API Documentation - Blog Service

This document provides comprehensive documentation for all API endpoints in the Blog Service, organized by functionality.

## Table of Contents
1. [Post Management](#post-management)
   - Create Post
   - Update Post
   - Delete Post
2. [Comment Management](#comment-management)
   - Get Comments
   - Add Comment
   - Update Comment
   - Delete Comment
3. [Like Management](#like-management)
   - Get Likes
   - Add Like
   - Remove Like

## Post Management

### 1. Create Post

*   **Endpoint:** `POST /api/posts`
*   **Description:** Creates a new blog post.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **Request Body:**
    ```json
    {
      "title": "string (required, min 5 chars)",
      "content": "string (required, min 100 chars)",
      "tags": ["string"], // Array of tag names (required, at least one)
      "categories": ["string"] // Array of category names (at least one, defaults to ['general'] if omitted)
    }
    ```
*   **Responses:**
    *   `201 Created`:
        ```json
        {
          "message": "Post created successfully",
          "post": {
            "_id": "postId",
            "title": "string",
            "content": "string",
            "author": "userId",
            "tags": ["tagId1", "tagId2"],
            "categories": ["categoryId1"],
            "comments": [],
            "likes": [],
            "createdAt": "timestamp",
            "updatedAt": "timestamp",
            "__v": 0
          }
        }
        ```
    *   `400 Bad Request`: If validation fails
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `500 Internal Server Error`: If there's a server-side issue

### 2. Update Post

*   **Endpoint:** `PUT /api/posts/:id`
*   **Description:** Updates an existing blog post. Only the author can update it.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to update (required).
*   **Request Body:** (Include only fields to update)
    ```json
    {
      "title": "string (optional, min 5 chars)",
      "content": "string (optional, min 100 chars)",
      "tags": ["string"], // Optional array of tag names
      "categories": ["string"] // Optional array of category names
    }
    ```
*   **Responses:**
    *   `200 OK`: Returns updated post object
    *   `400 Bad Request`: If validation fails
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `403 Forbidden`: If user is not the author
    *   `404 Not Found`: If post doesn't exist
    *   `500 Internal Server Error`: If there's a server-side issue

### 3. Delete Post

*   **Endpoint:** `DELETE /api/posts/:id`
*   **Description:** Deletes a blog post and its associated data (likes, comments).
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to delete (required).
*   **Responses:**
    *   `200 OK`:
        ```json
        {
            "message": "Post and associated data deleted successfully"
        }
        ```
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `403 Forbidden`: If user is not the author
    *   `404 Not Found`: If post doesn't exist
    *   `500 Internal Server Error`: If there's a server-side issue

## Comment Management

### 1. Get Comments

*   **Endpoint:** `GET /api/posts/:id/comments`
*   **Description:** Retrieves all comments for a specific blog post.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to get comments for (required).
*   **Responses:**
    *   `200 OK`: Returns array of comment objects
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `500 Internal Server Error`: If there's a server-side issue

### 2. Add Comment

*   **Endpoint:** `POST /api/posts/:id/comments`
*   **Description:** Adds a new comment to a blog post.
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
    *   `201 Created`: Returns created comment object
    *   `400 Bad Request`: If validation fails
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `404 Not Found`: If post doesn't exist
    *   `500 Internal Server Error`: If there's a server-side issue

### 3. Update Comment

*   **Endpoint:** `PUT /api/posts/:id/comments/:commentId`
*   **Description:** Updates an existing comment. Only the author can update it.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post (required).
    *   `commentId`: The ID of the comment to update (required).
*   **Request Body:**
    ```json
    {
      "content": "string (required)"
    }
    ```
*   **Responses:**
    *   `200 OK`: Returns updated comment object
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `403 Forbidden`: If user is not the author
    *   `404 Not Found`: If comment doesn't exist
    *   `500 Internal Server Error`: If there's a server-side issue

### 4. Delete Comment

*   **Endpoint:** `DELETE /api/posts/:id/comments/:commentId`
*   **Description:** Deletes a specific comment. Only the author can delete it.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post (required).
    *   `commentId`: The ID of the comment to delete (required).
*   **Responses:**
    *   `200 OK`:
        ```json
        {
          "message": "Comment deleted successfully"
        }
        ```
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `403 Forbidden`: If user is not the author
    *   `404 Not Found`: If comment doesn't exist
    *   `500 Internal Server Error`: If there's a server-side issue

## Like Management

### 1. Get Likes

*   **Endpoint:** `GET /api/likes/:id/likes`
*   **Description:** Retrieves all likes for a specific blog post.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to get likes for (required).
*   **Responses:**
    *   `200 OK`: Returns array of like objects
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `500 Internal Server Error`: If there's a server-side issue

### 2. Add Like

*   **Endpoint:** `POST /api/likes/:id/like`
*   **Description:** Adds a like to a blog post. A user can only like a post once.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to like (required).
*   **Responses:**
    *   `201 Created`: Returns created like object
    *   `400 Bad Request`: If user has already liked the post
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `404 Not Found`: If post doesn't exist
    *   `500 Internal Server Error`: If there's a server-side issue

### 3. Remove Like

*   **Endpoint:** `DELETE /api/likes/:id/like`
*   **Description:** Removes a like from a blog post. Only the user who added the like can remove it.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to unlike (required).
*   **Responses:**
    *   `200 OK`:
        ```json
        {
          "message": "Like removed successfully"
        }
        ```
    *   `401 Unauthorized`: If the token is missing or invalid
    *   `403 Forbidden`: If user is not the one who liked the post
    *   `404 Not Found`: If like doesn't exist
    *   `500 Internal Server Error`: If there's a server-side issue

## Common Response Formats

### Error Responses

All endpoints may return the following error responses:

*   `400 Bad Request`:
    ```json
    {
      "message": "Error message describing the validation failure"
    }
    ```

*   `401 Unauthorized`:
    ```json
    {
      "message": "Not authorized, no token"
    }
    ```

*   `403 Forbidden`:
    ```json
    {
      "message": "Not authorized to perform this action"
    }
    ```

*   `404 Not Found`:
    ```json
    {
      "message": "Resource not found"
    }
    ```

*   `500 Internal Server Error`:
    ```json
    {
      "message": "Error message",
      "error": "Detailed error information"
    }
    ```

## Authentication

All endpoints require authentication using a Bearer token in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

The token should be obtained through the authentication system and included in all API requests. 