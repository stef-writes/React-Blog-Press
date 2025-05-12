import { createBrowserRouter, Navigate } from "react-router-dom"; // Imports necessary functions from React Router
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute"; // Imports the ProtectedRoute component
import RestrictedRoute from "../components/RestrictedRoute/RestrictedRoute"; // Imports the RestrictedRoute component
import Layout from "../components/Layout/Layout"; // Imports the Layout component

import Login from "../pages/Login"; // Imports the Login page component
import Register from "../pages/Register"; // Imports the Register page component
import BlogList from "../pages/BlogList"; // Imports the BlogList page component
import PostDetail from "../pages/PostDetail"; // Imports the PostDetail page component
import NewPost from "../pages/NewPost"; // Imports the NewPost page component
import EditPost from "../pages/EditPost"; // Imports the EditPost page component
import Profile from "../pages/Profile"; // Imports the Profile page component
import Settings from "../components/Settings/Settings"; // Imports the Settings component
import PostManagerPage from "../pages/PostManagerPage"; // Imports the PostManagerPage component
import FormExamplePage from "../pages/FormExamplePage"; // Imports the FormExamplePage component
import NotFound from "../pages/NotFound"; // Imports the NotFound page component

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Sets the Layout component as the root element
    errorElement: <NotFound />,  // Sets the NotFound component as the error element
    children: [
      {
        index: true, // Sets this route as the index route
        element: (
          <RestrictedRoute>
            <Navigate to="/register" replace />   {/* Redirects to /register if not */}
          </RestrictedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <RestrictedRoute>
            <Register />      {/* Renders the Register component if not authenticated */}
          </RestrictedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <RestrictedRoute>
            <Login />       {/* Renders the Login component if not authenticated */}
          </RestrictedRoute>
        ),
      },
      {
        path: "posts",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <BlogList />     {/* Renders the BlogList component if authenticated */}
              </ProtectedRoute>
            ),
          },
          {
            path: ":id",
            element: (
              <ProtectedRoute>
                <PostDetail />      {/* Renders the PostDetail component if authenticated */}
              </ProtectedRoute>
            ),
          },
          {
            path: "new",
            element: (
              <ProtectedRoute>
                <NewPost />   {/* Renders the NewPost component if authenticated */}
              </ProtectedRoute>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ProtectedRoute>
                <EditPost />     {/* Renders the EditPost component if not authenticated */}
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />         {/* Renders the Profile component if not authenticated */}
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />          {/* Renders the Settings component if not authenticated */}
          </ProtectedRoute>
        ),
      },
      {
        path: "post-manager",
        element: (
          <ProtectedRoute>
            <PostManagerPage />      {/* Renders the PostManager component if not authenticated */}
          </ProtectedRoute>
        ),
      },
      {
        path: "form",
        element: (
          <ProtectedRoute>
            <FormExamplePage />      {/* Renders the FormManager component if not authenticated */}
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    // Renders the NotFound component for all other routes
    element: <NotFound />,
  },
]);
