import { useState, useCallback } from "react"; // Import useState for managing state and useCallback for memoizing functions.

export function useForm(initialValues = {}, validate = () => ({})) { // A custom hook for managing form state and validation. Takes initial form values and a validation function as arguments.  If no validation function is provided, a default empty object is used, effectively skipping validation.
  const [values, setValues] = useState(initialValues); // State for storing form field values. Initialized with initialValues.
  const [errors, setErrors] = useState({}); // State for storing validation errors. Initialized as an empty object.
  const [touched, setTouched] = useState({}); // State for tracking which fields have been touched/blurred. Initialized as an empty object. Not used in the current implementation
  const [isSubmitting, setIsSubmitting] = useState(false); // State for tracking form submission status. Initialized to false.

    // useCallback for memoizing the handleChange function
  const handleChange = useCallback(
    (e) => {    // Function to handle changes in form fields. Takes an event object as an argument.
      const { name, value } = e.target;   // Extract name and value from the event target.
      setValues((prev) => ({ ...prev, [name]: value }));  // Update the values state with the new value, using name as the key.

      // Clear the error for the field being modified  (provides immediate feedback to the user)
      if (errors[name]) {  // If there's an existing error for this field
        setErrors((prev) => ({ ...prev, [name]: "" }));  // Clear the error for this field by setting it to an empty string.
      }
    },
    [errors] // Dependency array: This function depends on the errors state.
  );

    // useCallback for memoizing the handleBlur function
  const handleBlur = useCallback(
    (e) => {  // Function to handle blur events (when a field loses focus). Takes event object
      const { name } = e.target;  //get name from event target
      setTouched((prev) => ({ ...prev, [name]: true }));  // Update the touched state to mark the field as touched.  Not used in current implementation

      // Validate field on blur
      const fieldErrors = validate({ [name]: values[name] }); // Validate only the blurred field using the provided validate function.
      setErrors((prev) => ({ ...prev, ...fieldErrors }));  // Update the errors state with any validation errors.
    },
    [values, validate] // Dependency array: This function depends on the values state and the validate function.
  );

  // useCallback for memoizing the handleSubmit function
  const handleSubmit = useCallback(
    async (onSubmit) => {   // Function to handle form submission. Takes an onSubmit callback function as an argument.
      setIsSubmitting(true);   // Set isSubmitting to true to indicate form submission is in progress.  Can be used to disable submit button, show loading indicator, etc.

      // Validate all fields
      const formErrors = validate(values);  // Validate all form field values using the validate function.
      setErrors(formErrors);  // Update the errors state with all validation errors.

      if (Object.keys(formErrors).length === 0) {  // If there are no validation errors
        try {
          await onSubmit(values);  // Call the provided onSubmit function with the form values.  This assumes onSubmit is an async function.
          setValues(initialValues);   // Reset the form to its initial values after successful submission.
          setTouched({});   //reset touched
        } catch (error) {     //catch any error during onSubmit
          setErrors((prev) => ({ ...prev, submit: error.message }));  // If an error occurs during submission, set a 'submit' error in the errors state.
        }
      }

      setIsSubmitting(false);  // Set isSubmitting back to false after submission is complete (successful or not).
    },
    [values, validate, initialValues] // Dependency array: This function depends on values, validate, and initialValues.
  );

  const reset = useCallback(() => {  //function to reset form
    setValues(initialValues);   //reset values to initialValues
    setErrors({});            //clear errors
    setTouched({});           //clear touched fields
    setIsSubmitting(false);  //set isSubmitting to false
  }, [initialValues]);  // Dependency array: This function depends on initialValues.

  // Validation helper for edge cases  (this function performs additional validation)
  const enhancedValidate = useCallback(
    (fieldValues) => {   //takes an object of field values as input
      const newErrors = {};  //create empty object to store errors

      for (const field in fieldValues) {  //iterate over each field in fieldValues
        const value = fieldValues[field];    //get the value of the field

        // Generic validation for empty fields
        if (!value?.trim()) {   //if value is empty or contains only whitespace
          newErrors[field] = `${field} is required.`;   //set error message that field is required
          continue; // Continue to the next field  (important optimization: avoids unnecessary checks if a field is already invalid)
        }

        // Specific validation for email fields
        if (
          field === "email" &&      //if field is email and value is not a valid email
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ) {
          newErrors[field] = "Invalid email address.";  //set error message for invalid email
          continue;   //continue to next field
        }

        // Add additional field-specific validations as needed  Placeholder for adding more validation rules.
      }

      return newErrors;   //return errors object
    },
    []   //empty dependency array since this function doesn't depend on any external values
  );

  return {     //return an object containing form related data and functions
    values,      //form field values
    errors,      //validation errors
    touched,     //touched fields, not used in current implementation but can be used to conditionally display error messages after a field has been touched
    isSubmitting, //submission status
    handleChange,  //function to handle field changes
    handleBlur,    //function to handle blur events
    handleSubmit,  //function to handle form submission
    reset,         //function to reset form
    validate: enhancedValidate, //the enhanced validation function
  };
}
