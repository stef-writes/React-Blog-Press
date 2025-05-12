# Blog Project: Expanding the Blog

Welcome to the final project of the coding bootcamp! Over the next four days, you'll be enhancing the existing blog application by adding crucial features and solidifying your full-stack development skills.

## Project Overview

This project builds upon your existing frontend (React) and backend (microservices) knowledge. You have already built a basic blog using React and have experience creating microservices. Now, you'll integrate these skills by expanding a partially completed blog service and connecting it to the existing frontend.

The provided codebase includes:

*   **Frontend:** The React blog application you built earlier.

*   **Backend:** A microservice architecture with:

    *   **API Gateway:** A fully implemented gateway for routing requests.

    *   **Auth Service:** A fully implemented service for user authentication.

    *   **Blog Service:** A partially completed service managing blog posts.

## Your Tasks

Your mission is to complete the `blog-service` and integrate it with the frontend. Specifically, you will:

1.  **Implement Update and Delete Post Functionality:** Add the ability to modify existing blog posts and remove them entirely.

2.  **Implement Comments Functionality:** Allow users to add, edit, and delete comments on blog posts, and display all comments associated with each post.

3.  **Implement Likes Functionality:** Enable users to "like" and "unlike" blog posts, and display the total number of likes for each post.

**Integration and Testing:**

*   For each feature you implement, update the frontend to interact with the new backend endpoints.

*   Write comprehensive test cases (using Jest and Supertest) for all new backend code.

*   Update the API documentation (provided in the `docs` folder) to reflect your changes.

## Project Structure

react-blog-press/ 
├── frontend/          # React frontend application 
├── backend/           # Microservices backend 
│   ├── api-gateway/   # Fully implemented API Gateway 
│   ├── auth-service/  # Fully implemented Auth Service 
│   ├── blog-service/  # Partially completed Blog Service 
│   └── ...            # Other necessary backend files (e.g., Dockerfile, dependencies) 
├── docs/              # API documentation (e.g., Swagger, Postman collection) 
└── README.md          # This file

## Daily Breakdown

This project is divided into four parts:

*   **Day 1: Update Post Functionality**

*   **Day 2: Delete Post Functionality**

*   **Day 3: Comments Functionality**

*   **Day 4: Likes Functionality**

(See detailed instructions for each day below.)

## Setup and Running the Project

**Important:** Follow these instructions carefully to ensure the project runs correctly.

### 1. Backend Setup

#### 1.1 MongoDB Atlas Setup (Database)

1.  **Create a MongoDB Atlas Account:**

    *   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

    *   Sign up for a free account or log in (you can use your Google account).

2.  **Create Database Access Credentials:**

    *   After logging in, navigate to the **Database Access** tab (under Security in the left-hand menu).

    *   Click **Add New Database User**.

    *   Choose **Password** authentication.

    *   Enter a username and a strong password. **Important:** Remember these credentials; you'll need them later.

    *   Under **Database User Privileges**, select **Read and write to any database**. (For production, you'd use more restrictive permissions.)

    *   Click **Add User**.

3.  **Set Up Network Access:**

    *   Go to the **Network Access** tab (under Security).

    *   Click **Add IP Address**.

    *   **Option 1 (Development):** Click **Allow Access From Anywhere**. This is easiest for development but **not recommended for production**.

    *   **Option 2 (More Secure):** Click **Add Current IP Address**. This is more secure but requires you to update the IP address if your network changes.

    *   Click **Confirm**.

4.  **Create a Cluster:**

    *   In the left-hand menu, click **Database**.

    *   Click **Create**.

    *   Select **M0 Sandbox** (the free tier) and choose a provider and region (choose one close to you).

    *   Give your cluster a name (e.g., "blog-cluster").

    *   Click **Create Cluster**. It will take a few minutes to deploy.

5.  **Get the Connection String:**

    *   Once your cluster is ready, click the **Connect** button.

    *   Choose **Connect your application**.

    *   Select **Node.js** as the driver and choose the latest version.

    *   Copy the connection string. It will look like this:

        ```

        mongodb+srv://<username>:<password>@clustername.mongodb.net/<dbname>?retryWrites=true&w=majority

        ```

        **Important:** Replace `<username>`, `<password>`, and `<dbname>` (if you want a specific database name; otherwise, it defaults to `test`) with your actual credentials and database name. **Save this connection string securely; you'll need it in the next step.**

#### 1.2 Project Setup (Backend Code)

1.  **Install Node.js and npm:** If you don't have them already, download and install Node.js from [nodejs.org](https://nodejs.org/). npm (Node Package Manager) comes bundled with Node.js.

2.  **Install Dependencies:**

    *   Open your terminal and navigate to the `backend` directory.

    *   Then, navigate into each service directory (`api-gateway`, `auth-service`, `blog-service`) one by one.

    *   Run the following command in each service directory:

        ```bash

        npm install

        ```

3.  **Install Testing Libraries:**

    *   In each service directory (`api-gateway`, `auth-service`, `blog-service`), run:

        ```bash

        npm install --save-dev jest supertest

        ```

4.  **Configure Environment Variables (.env):**

    *   **Important:** Each service has a `.env.example` file. Rename it to `.env` in each service directory

    *   **api-gateway/.env:**

        ```

        PORT=5000 # Choose a port for the API Gateway

        AUTH_SERVICE_URL=http://localhost:5001 # URL of the auth service

        BLOG_SERVICE_URL=http://localhost:5002 # URL of the blog service

        ```

    *   **auth-service/.env:**

        ```

        PORT=5001 # Choose a port for the auth service

        MONGO_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING> # Paste your connection string here

        JWT_SECRET=your-secret-key # Choose a strong secret key for JWT

        ```

    *   **blog-service/.env:**

        ```

        PORT=5002 # Choose a port for the blog service

        MONGO_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING> # Paste your connection string here

        AUTH_SERVICE_URL=http://localhost:5001

        ```

        **Important:**

        *   Make sure the `MONGO_URI` is correct in both `auth-service` and `blog-service`.

        *   Use unique port numbers for each service.

        *   The `JWT_SECRET` in `auth-service` should be a long, random, and secure string.

#### 1.3 Running the Backend

1.  **Start Each Service:**

    *   Open three separate terminal windows (one for each service).

    *   In each terminal, navigate to the service's directory (`api-gateway`, `auth-service`, `blog-service`).

    *   Run:

        ```bash

        node server.js 

        ```

        (or `node index.js` or whichever is the main entry point file for that service, you can check in the package.json scripts to identify the main entry point)

2.  **Verify:** You should see messages indicating that each service has started successfully and is connected to the database.

### 2. Frontend Setup

#### 2.1 Setup Instructions

1.  **Navigate to Frontend Directory:** In a new terminal, navigate to the `frontend` directory.

2.  **Install Dependencies:**

    ```bash

    npm install --legacy-peer-deps

    ```

3.  **Configure API Base URL:**

    *   Rename the `.env.example` file in the `frontend` directory to `.env`

    *   Open the `.env` file.

    *   Update the `API_BASE_URL` (or a similar variable) to match the URL where your API Gateway is running (e.g., `http://localhost:5000` if you used port 5000 for the API Gateway).

#### 2.2 Running the Frontend

1.  **Start Development Server:**

    ```bash

    npm run dev

    ```

    (or `npm start` or `npm run start`, you can check the `package.json` file to confirm)

2.  **Access in Browser:** Open your web browser and go to the URL indicated in the terminal (usually `http://localhost:5173` or `http://localhost:3000`).

#### 2.3 Running Frontend Tests

   * In the `frontend` directory, run

   ```bash

   npm test

#### Troubleshooting
1. Port Conflicts: If you get an error about a port being in use, make sure you've used unique port numbers in your .env files and that no other applications are using those ports.
2. MongoDB Connection Issues: Double-check your MONGO_URI in the .env files. Ensure it's correct and that you've replaced the placeholders with your actual credentials. Also, verify that your IP address is allowed in MongoDB Atlas's Network Access settings.
3. Frontend Not Connecting: Make sure the API_BASE_URL in your frontend's .env file is correct and that the API Gateway is running. Use your browser's developer tools (Network tab) to see if API requests are being made and if they're successful.

## Good luck, and happy coding!
