// Import the 'pino' logging library. Pino is a fast and efficient logger for Node.js applications.
const pino = require("pino");
// Import the 'path' module for working with file and directory paths.  Provides utilities for working with file and directory paths
const path = require("path");

// Create a Pino logger instance with configured options.
const logger = pino({
  // Set the logging level. This determines the minimum severity level of log messages that will be recorded.
  // If the 'LOG_LEVEL' environment variable is set, its value will be used; otherwise, it defaults to 'info'.  Common Log Levels include 'fatal', 'error', 'warn', 'info', 'debug', 'trace'
  level: process.env.LOG_LEVEL || "info",
  // Configure how Pino transports (outputs) log messages.
  transport: {
    targets: [
      //pino can output to multiple targets at the same time.  Here we are outputting to the console and to a file
      {
        // Output logs to the console in a pretty, human-readable format with colors.  pino-pretty is a separate package
        target: "pino-pretty",
        options: { colorize: true },
      },
      {
        // Output logs to a file.  pino/file is a transport built into pino for writing logs to files
        target: "pino/file",
        // Specify the destination file path for the logs. __dirname gives you the current directory, and path.join constructs a path to the log file relative to the current directory
        options: { destination: path.join(__dirname, "../logs/blog.log") }, //__dirname represents the directory of the current file, .. goes up one directory level
      },
    ],
  },
});

// Export the logger instance to make it available for use in other parts of the application.  This allows other modules to import and use the logger
module.exports = logger;
