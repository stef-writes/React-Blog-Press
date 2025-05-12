/* eslint-disable no-undef */
// Import the exec function from the child_process module
const { exec } = require("child_process");

// Define an async function to handle the deployment process
async function deploy() {
  try {
    // Build the application
    console.log("Building application...");
    await execCommand("npm run build"); // Execute the "npm run build" command

    // Optimize images
    console.log("Optimizing images...");
    await execCommand("npm run optimize-images"); // Execute the "npm run optimize-images" command

    // Generate service worker
    console.log("Generating service worker...");
    await execCommand("npm run generate-sw"); // Execute the "npm run generate-sw" command

    // Run tests
    console.log("Running tests...");
    await execCommand("npm run test"); // Execute the "npm run test" command

    // Deploy to hosting
    console.log("Deploying to hosting...");
    await execCommand("npm run deploy-hosting"); // Execute the "npm run deploy-hosting" command

    // Log a success message
    console.log("Deployment complete!");
  } catch (error) { // Catch any errors that occur during the deployment process
    console.error("Deployment failed:", error); // Log the error message
    process.exit(1); // Exit the process with a non-zero exit code to indicate failure
  }
}

// Define a function to execute a command and return a promise
function execCommand(command) {
  return new Promise((resolve, reject) => { // Create a new promise
    // Execute the command using the exec function
    exec(command, (error, stdout, stderr) => { // Callback function to handle the command execution result
      if (error) { // Check if there was an error
        console.error(`Error: ${error.message}`); // Log the error message
        console.error(`Stderr: ${stderr}`); // Log the standard error output
        reject(error); // Reject the promise with the error
        return; // Return to prevent further execution
      }
      console.log(stdout); // Log the standard output
      resolve(); // Resolve the promise indicating successful execution
    });
  });
}


// Call the deploy function to start the deployment process
deploy();
