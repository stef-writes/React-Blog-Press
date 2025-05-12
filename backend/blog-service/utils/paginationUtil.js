// Import the logger instance for logging events.
const logger = require("../blogLogs/logger");

const paginate = async (model, page = 1, limit = 10, query = {}) => {
  // Use a try...catch block to handle potential errors during the pagination process.
  try {
    // Calculate the number of documents to skip based on the current page and limit,  If you are on page one, you skip 0.  If you are on page 2 you skip 10
    const skip = (page - 1) * limit;
    // Get the total number of documents that match the query.  This is used to calculate the total number of pages
    const totalDocuments = await model.countDocuments(query);
    // Query the database to retrieve the paginated data. model.find(query) executes the query against the model. skip(skip) skips the calculated number of documents. limit(limit) limits the number of documents returned to the specified limit.
    const data = await model.find(query).skip(skip).limit(limit);

    // Calculate the total number of pages based on the total documents and limit per page. Math.ceil rounds up to the nearest integer to ensure all documents are accounted for in the pages.
    const totalPages = Math.ceil(totalDocuments / limit);

    // Log pagination information. This can be helpful for debugging and monitoring.  This includes the name of the model, the requested page, the limit, total documents and the total pages
    logger.info({
      message: "Pagination executed",
      model: model.modelName, // Get the name of the model
      page,
      limit,
      totalDocuments,
      totalPages,
    });

    // Return an object containing the paginated data and pagination metadata (total documents, total pages, current page).
    return {
      data, // Paginated data for the current page
      pagination: {
        // Metadata about the pagination
        totalDocuments, // Total number of documents matching the query
        totalPages, // Total number of pages
        currentPage: Number(page), // Current page number (converted to a number)
      },
    };
  } catch (error) {
    // Log an error message if an error occurs during pagination.
    logger.error(`Error during pagination: ${error.message}`);
    // Throw a new error to indicate that pagination failed. This will help in handling the error at a higher level in the application
    throw new Error("Pagination failed");
  }
};

// Export the 'paginate' function to make it available for use in other modules.
module.exports = paginate;
