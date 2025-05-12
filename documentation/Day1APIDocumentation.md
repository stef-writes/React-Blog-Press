# API Documentation - Blog Service (Day 1)

This document covers the API endpoints related to Day 1 functionality: Creating and Updating Blog Posts.

## Endpoints

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
      "categories": ["string"] // Array of category names (at least one, defaults to ['general'] if omitted, though frontend sends one)
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
    *   `400 Bad Request`: If validation fails (e.g., missing fields, length requirements).
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `500 Internal Server Error`: If there's a server-side issue.

### 2. Update Post

*   **Endpoint:** `PUT /api/posts/:id`
*   **Description:** Updates an existing blog post. Only the author of the post can update it.
*   **Authentication:** Required (Bearer Token in `Authorization` header).
*   **URL Parameters:**
    *   `id`: The ID of the post to update (required).
*   **Request Body:** (Include only the fields you want to update)
    ```json
    {
      "title": "string (optional, min 5 chars)",
      "content": "string (optional, min 100 chars)",
      "tags": ["string"], // Optional array of tag names
      "categories": ["string"] // Optional array of category names
    }
    ```
*   **Responses:**
    *   `200 OK`:
        ```json
        {
          "message": "Post updated successfully",
          "post": { // The updated post object with populated author, tags, categories
            "_id": "postId",
            "title": "updated string",
            "content": "updated string",
            "author": { ...author details },
            "tags": [ { ...tag details }, ... ],
            "categories": [ { ...category details }, ... ],
            "comments": [ ... ],
            "likes": [ ... ],
            "createdAt": "timestamp",
            "updatedAt": "timestamp",
            "__v": number
          }
        }
        ```
    *   `400 Bad Request`: If validation fails.
    *   `401 Unauthorized`: If the token is missing or invalid.
    *   `403 Forbidden`: If the authenticated user is not the author of the post.
    *   `404 Not Found`: If the post with the given `id` does not exist.
    *   `500 Internal Server Error`: If there's a server-side issue.
