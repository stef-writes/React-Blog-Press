// Import useForm custom hook for form management
import { useForm } from "../../hooks/useForm";
// Import useState hook from React
import { useState } from "react";
// Import CSS styles for the component
import styles from "./FormExample.module.css";

// Define the FormExample functional component
function FormExample() {
    // Initialize state for tracking form submission status using useState hook, initially set to false
  const [hasSubmitted, setHasSubmitted] = useState(false);

    // Define a validation function for form values
  const validate = (values) => {
    const errors = {}; // Initialize an empty errors object
        // Validate name field
    if (!values.name) {
      errors.name = "Name is required"; // Set error message if name is empty
    } else if (values.name.length < 3) {
      errors.name = "Name must be at least 3 characters"; // Set error message if name is too short
    }

        // Validate email field
    if (!values.email) {
      errors.email = "Email is required"; // Set error message if email is empty
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            // Use regular expression to validate email format
      errors.email = "Email is invalid"; // Set error message if email format is invalid
    }

    return errors; // Return the errors object
  };

  // Use the useForm custom hook to manage form state and validation
  const {
    values, // Form values
    errors, // Form errors
    handleChange, // Function to handle input changes
    handleBlur, // Function to handle input blur events
    handleSubmit, // Function to handle form submission
    reset, // Function to reset the form
  } = useForm({ name: "", email: "" }, validate); // Initialize form with empty name and email, and pass the validate function

    // Function to handle form submission
  const onSubmit = async (formData) => {
        // Load existing form data from localStorage, defaulting to an empty array if no data is found
    const existingData = JSON.parse(localStorage.getItem("formData")) || [];
        // Add the new form data to the existing data
    const updatedData = [...existingData, formData];
        // Save the updated data to localStorage
    localStorage.setItem("formData", JSON.stringify(updatedData));

    // Display an alert with the submitted form data
    alert(`Form Submitted and Saved to LocalStorage: ${JSON.stringify(formData)}`);
        // Reset the form after successful submission
    reset();
    // Reset the submission status
    setHasSubmitted(false);
  };


  // Function to handle the form submission event
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setHasSubmitted(true); // Set hasSubmitted state to true to trigger error display
    handleSubmit(onSubmit); // Call the handleSubmit function from useForm hook with the onSubmit callback
  };

    // Render the component JSX
  return (
        // Form container with styles
    <div className={styles.formContainer}>
      <h2>Form Example</h2> {/* Form title */}
            {/* Form element with onSubmit handler */}
      <form onSubmit={handleFormSubmit}>
                {/* Name input group */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label> {/* Label for name input */}
          <input
            type="text" // Set input type to text
            id="name" // Set input id
            name="name" // Set input name
            value={values.name} // Set input value from form values
            onChange={handleChange} // Call handleChange function from useForm hook on input change
            onBlur={handleBlur} // Call handleBlur function from useForm hook on input blur
            className={errors.name && hasSubmitted ? styles.errorInput : ""} // Apply error styles if there is a name error and the form has been submitted
          />
                    {/* Display name error message if there is an error and the form has been submitted */}
          {errors.name && hasSubmitted && (
            <span className={styles.error}>{errors.name}</span>
          )}
        </div>

                {/* Email input group */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label> {/* Label for email input */}
          <input
            type="email" // Set input type to email
            id="email" // Set input id
            name="email" // Set input name
            value={values.email} // Set input value from form values
            onChange={handleChange} // Call handleChange function from useForm hook on input change
            onBlur={handleBlur} // Call handleBlur function from useForm hook on input blur
            className={errors.email && hasSubmitted ? styles.errorInput : ""} // Apply error styles if there is an email error and the form has been submitted
          />
                    {/* Display email error message if there is an error and the form has been submitted */}
          {errors.email && hasSubmitted && (
            <span className={styles.error}>{errors.email}</span>
          )}
        </div>

                {/* Action buttons container */}
        <div className={styles.actions}>
                    {/* Submit button */}
          <button type="submit" className={styles.submitButton}> {/* Apply submit button styles */}
            Submit {/* Button label */}
          </button>
                    {/* Reset button */}
          <button
            type="button" // Set button type to button to prevent form submission
            onClick={() => {
              reset(); // Reset the form
              setHasSubmitted(false); // Reset submission state
            }}
            className={styles.resetButton} // Apply reset button styles
          >
            Reset {/* Button label */}
          </button>
        </div>
      </form>
    </div>
  );
}

// Export the FormExample component as the default export
export default FormExample;
