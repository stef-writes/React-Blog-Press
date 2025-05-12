const pino = require("pino"); // Import Pino for logging

const logger = pino({
  level: process.env.LOG_LEVEL || "info", // Set log level from environment variables
  transport: {
    targets: [
      {
        target: "pino-pretty", // Pretty-print logs for console
        options: { colorize: true }, // Add colors to logs for better readability
      },
      {
        target: "pino/file", // Log to a file
        options: { destination: "./logs/auth.log" }, // Log file location
      },
    ],
  },
});

module.exports = logger; // Export the logger instance
