const fs = require("fs"); // Import the built-in 'fs' module for file system operations.
const path = require("path"); // Import the built-in 'path' module for working with file and directory paths.
const pino = require("pino"); // Import the 'pino' logging library.  Pino is a fast and efficient logger for Node.js
const pinoHttp = require("pino-http"); // Import the 'pino-http' middleware for logging HTTP requests.


// Define the directory where log files will be stored. __dirname represents the current directory.
const logDir = path.join(__dirname, "logs");

// Check if the 'logs' directory exists.
if (!fs.existsSync(logDir)) {
  // If the directory doesn't exist, create it recursively (including parent directories if needed).
  fs.mkdirSync(logDir, { recursive: true });
}

// Create a Pino logger instance with specific configurations.
const loggerInstance = pino({
  // Set the logging level. This determines which log messages are recorded.  It defaults to 'info' if the environment variable LOG_LEVEL is not set
  // Levels: 'fatal', 'error', 'warn', 'info', 'debug', 'trace'
  level: process.env.LOG_LEVEL || "info", 
  transport: { // Configure how log messages are transported/outputted
    targets: [ // Define multiple output targets for logs
      {
        // Output logs to the console in a pretty, human-readable format with colors.
        target: "pino-pretty", 
        options: { colorize: true },
      },
      {
        // Output logs to a file named "gateway.log" in the 'logs' directory.
        target: "pino/file",
        options: { destination: path.join(logDir, "gateway.log") },
      },
    ],
  },
});

// Create a middleware function for logging HTTP requests using Pino.
// This middleware will log information about each incoming request.
const loggerMiddleware = pinoHttp({ logger: loggerInstance });


// Export the logger instance, making it available for use in other parts of the application..
module.exports = loggerInstance;

// Export the HTTP logging middleware as a separate property, allowing it to be used independently if needed.  For Example in an express app.
module.exports.middleware = loggerMiddleware;
