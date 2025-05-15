# API Documentation - Blog Service (Day 4)

This document covers the API endpoints related to Day 4 functionality: Like Management for Blog Posts.

## Endpoints

### 1. Get Likes for a Post

*   **Endpoint:** `GET /api/likes/:id/likes`
*   **Description:** Retrieves all likes for a specific blog post.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to get likes for (required).
*   **Responses:**
    *   `200 OK`: Returns an array of like objects
        ```json
        [
          {
            "_id": "likeId",
            "user": {
              "_id": "userId",
              "name": "User Name",
              "email": "user@example.com"
            },
            "post": "postId",
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
          },
          // More likes...
        ]
        ```
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `500 Internal Server Error`: If there's a server-side issue.

### 2. Add a Like to a Post

*   **Endpoint:** `POST /api/likes/:id/like`
*   **Description:** Adds a like to a specific blog post. A user can only like a post once.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to like (required).
*   **Request Body:** None required
*   **Responses:**
    *   `201 Created`: 
        ```json
        {
          "message": "Post liked successfully",
          "like": {
            "_id": "likeId",
            "user": "userId",
            "post": "postId",
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
          }
        }
        ```
    *   `400 Bad Request`: If the user has already liked the post
        ```json
        {
          "message": "You have already liked this post"
        }
        ```
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `404 Not Found`: If the post with the given ID does not exist.
    *   `500 Internal Server Error`: If there's a server-side issue.

### 3. Remove a Like from a Post

*   **Endpoint:** `DELETE /api/likes/:id/like`
*   **Description:** Removes a like from a specific blog post. Only the user who added the like can remove it.
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
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `403 Forbidden`: If the authenticated user is not the one who liked the post.
    *   `404 Not Found`: If the like does not exist for this user and post.
    *   `500 Internal Server Error`: If there's a server-side issue.

## Example Requests

### Get Likes for a Post

```
GET /api/likes/6825f4d63d420023f5dcf90c/likes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Add a Like to a Post

```
POST /api/likes/6825f4d63d420023f5dcf90c/like
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Remove a Like from a Post

```
DELETE /api/likes/6825f4d63d420023f5dcf90c/like
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
``` 