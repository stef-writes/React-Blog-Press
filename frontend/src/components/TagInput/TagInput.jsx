// Import necessary hooks for state management.
import { useState } from "react";
// Import PropTypes for prop type checking.
import PropTypes from "prop-types";
// Import CSS styles specific to this component.
import styles from "./TagInput.module.css";

// Define the functional component TagInput, which takes tags, onChange, onBlur, and error as props.
function TagInput({ tags, onChange, onBlur, error }) {
  // Initialize state for the input value using the useState hook.
  const [inputValue, setInputValue] = useState("");

  // Define a function to handle key down events in the input field.
  const handleKeyDown = (e) => {
    // Check if the pressed key is 'Enter'.
    if (e.key === "Enter") {
      // Prevent default form submission behavior.
      e.preventDefault();
      // Trim whitespace and convert the input value to lowercase.
      const newTag = inputValue.trim().toLowerCase();

      // Check if the new tag is not empty and not already included in the tags array.
      if (newTag && !tags.includes(newTag)) {
        // Call the onChange prop with the updated tags array including the new tag.
        onChange([...tags, newTag]);
        // Clear the input field.
        setInputValue("");
      }
    }
  };

  // Define a function to remove a tag from the tags array.
  const removeTag = (tagToRemove) => {
    // Call the onChange prop with a new tags array that excludes the tag to be removed.
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  // Return the JSX to render the component.
  return (
    <div className={styles.form_group}>
      <label className={styles.label}>Tags *</label>
      <div className={`${styles.tag_input} ${error ? styles.error : ""}`}>
        <div className={styles.tag_list}>
          {/* Map over the tags array to render each tag as a span. */}
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
              {/* Button to remove the tag. */}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className={styles.tag_remove}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {/* Input field for adding new tags. */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          placeholder="Type and press Enter to add tags"
          className={styles.input_field}
        />
      </div>
      {/* Display error message if the error prop is provided. */}
      {error && <span className={styles.error_message}>{error}</span>}
    </div>
  );
}

// Define PropTypes for the component's props.
TagInput.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired, // tags is required and must be an array of strings.
  onChange: PropTypes.func.isRequired, // onChange is required and must be a function.
  onBlur: PropTypes.func.isRequired, // onBlur is required and must be a function.
  error: PropTypes.string, // error is optional and must be a string if provided.
};

// Export the TagInput component as the default export.
export default TagInput;
