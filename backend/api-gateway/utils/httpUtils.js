const fetch = require("node-fetch"); // Import node-fetch for making HTTP requests
const logger = require("../gatewayLogger/logger"); // Import logger for logging request and response details

// Function to forward requests to microservices
exports.forwardRequest = async (res, service, path, method, body = null) => {
  try {
    // Determine the base URL of the service from environment variables
    const baseUrl = process.env[`${service.toUpperCase()}_URL`];

    // Build the full URL
    const url = `${baseUrl}${path}`;

    // Configure the request options
    const options = {
      method, // HTTP method (GET, POST, etc.)
      headers: { "Content-Type": "application/json" }, // Set JSON content type
      body: body ? JSON.stringify(body) : null, // Include body for POST/PUT requests
    };

    // Log the forwarded request
    logger.info({ url, method, body }, "Forwarding request to microservice");

    // Make the request to the microservice
    const response = await fetch(url, options);

    // Parse the response from the microservice
    const data = await response.json();

    // Log the response
    logger.info({ url, status: response.status, data }, "Received response from microservice");

    // Return the response to the client
    res.status(response.status).json(data);
  } catch (error) {
    // Log the error
    logger.error({ error: error.message }, "Error forwarding request");

    // Respond with an error
    res.status(500).json({ message: "Error forwarding request", error: error.message });
  }
};
