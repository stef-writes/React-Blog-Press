// Import necessary modules from React library
import { StrictMode } from "react"; //StrictMode is a tool for highlighting potential problems in an application
import { createRoot } from "react-dom/client"; //createRoot is a method to render a React application to the DOM
import "./index.css"; // Import the main CSS file for styling
import App from "./App.jsx"; // Import the main App component

// Get a reference to the root element in the HTML document. This is where the React application will be rendered.
const rootElement = document.getElementById("root");

//create a root using createRoot
const root = createRoot(rootElement);

// Render the App component within a StrictMode element.
// StrictMode helps identify potential issues during development.  It activates additional checks and warnings.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
