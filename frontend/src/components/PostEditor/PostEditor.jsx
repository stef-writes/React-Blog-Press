import { useState, useEffect } from "react"; // Import necessary React hooks
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import PropTypes from "prop-types"; // Import PropTypes for prop type checking
import TagInput from "../TagInput/TagInput"; // Import custom TagInput component
import styles from "./PostEditor.module.css"; // Import CSS styles
import BlogPost from "../BlogPost/BlogPost"; // Import BlogPost component for preview
import RichTextEditor from "../RichTextEditor/RichTextEditor"; //Import rich text editor for content editing

// PostEditor component definition
function PostEditor({ post = {}, isDarkMode }) {
  // post: initial post data (optional), isDarkMode: flag for dark mode
  // Initialize state variables
  const [formData, setFormData] = useState({
    // State for storing form data, initialized with default values or values from the 'post' prop if provided
    id: undefined, // Post ID, undefined for new posts
    title: "", // Post title
    content: "", // Post content
    author: "", // Post author  (this will likely come from the logged in user, but the initial value is an empty string)
    tags: [], // Post tags (array)
    category: "general", // Post category, defaults to 'general'
    isPublished: false, // Publication status
    image: null, // Post image (initially null)
  });

  const [errors, setErrors] = useState({}); // State for storing validation errors
  const navigate = useNavigate(); // Hook for navigating programmatically

  useEffect(() => {
    // Use effect hook to populate the form with existing post data if provided for editing a post.  This effect runs when the `post` prop changes.
    if (post && post.id) {
      // Check if a post object with an ID is provided  If there is a post and it has an id, it means we are editing an existing post
      setFormData({
        // Populate the formData state with values from the existing post
        id: post.id,
        title: post.title || "",
        content: post.content || "",
        author: post.author || "",
        tags: post.tags || [],
        category: post.category || "general",
        isPublished: post.isPublished || false,
        image: post.image || null,
      });
    }
  }, [post]); // The dependency array [post] ensures that this effect only runs when the post prop changes

  const validateField = (name, value) => {
    //Validation function for individual form fields  name: Field name, value: Field value
    switch (
      name // Perform validation based on field name
    ) {
      case "title":
        //Check if the title is at least 5 characters long
        return value.trim().length < 5 //trim removes whitespace from beginning and end of string
          ? "Title must be at least 5 characters" //Error message if title too short
          : ""; // Empty string if valid
      case "content":
        //Check if the content is at least 100 characters long
        return value.trim().length < 100
          ? "Content must be at least 100 characters"
          : ""; //Empty string if valid
      case "tags":
        return value.length === 0 ? "At least one tag is required" : ""; //Check if there's at least one tag
      default:
        return ""; //Return empty for other fields (no validation)
    }
  };

  // Function to handle changes in form inputs
  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target; // Destructure event target properties
    let newValue = type === "checkbox" ? checked : value; // Get the new value based on input type

    // Handle image uploads
    if (type === "file" && files[0]) {
      //Check if input type is 'file' and a file was selected
      const file = files[0]; // Get the selected file
      // Check if the selected file is an image
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        setErrors((prev) => ({
          // Set error message for invalid file type
          ...prev,
          image: "Only JPEG, PNG, and GIF images are allowed",
        }));
        return; // Stop further processing
      }
      //Convert image to base64
      newValue = await convertToBase64(file); // Convert image to base64 and assign to newValue
    }

    // Update form data state
    setFormData((prev) => ({
      // Update formData state with the new value
      ...prev, // Use the spread operator to maintain existing data
      [name]: newValue, // Update the field with the new value using computed property name
    }));
  };

  const convertToBase64 = (file) => {
    //Helper function to convert a file to base64 string. This is often used to embed images directly into the data being sent.
    return new Promise((resolve, reject) => {
      //Return a Promise that resolves with the base64 string
      const reader = new FileReader(); // Create a new FileReader instance
      reader.onload = () => resolve(reader.result); //Resolve the promise with the base64 string when the file is loaded
      reader.onerror = (error) => reject(error); //Reject the promise if an error occurs
      reader.readAsDataURL(file); //Start reading the file as a data URL (base64)
    });
  };

  const handleBlur = (e) => {
    //Handle blur event (when an input field loses focus) to trigger validation
    const { name, value } = e.target; // Get the field name and value
    setErrors((prev) => ({
      // Update the errors state with validation result for the blurred field.
      ...prev, //Spread operator to keep existing errors
      [name]: validateField(name, value), // Validate the field and update the error message
    }));
  };

// TODO Update handleSubmit Function
    // 1: Check the condition where !formData.id is validating
      // Remove this condition so that update functionality can also be implemented here

    // 2: Identify Where the apiUrl and method are Defined
      // Locate the part of the handleSubmit function where the apiUrl and method variables are being defined.

    // 3: Update the apiUrl Variable
      // Modify the apiUrl to dynamically check if formData.id exists.
      // If formData.id is truthy:
        // Set the apiUrl to include the formData.id in the endpoint.
      // If formData.id is falsy:
        // Set the apiUrl to the base URL for creating a new post.

    // 4: Update the method Variable
      // Check if formData.id exists.
      // If formData.id is truthy:
        // Set the method to "PUT".
      // If formData.id is falsy:
        // Set the method to "POST"

  const handleSubmit = async (e) => {
    //Function to handle form submission
    e.preventDefault(); // Prevent default form submission behavior

    const newErrors = {}; //Create an empty object to store new errors

    Object.keys(formData).forEach((key) => {
      //Validate all fields in formData
      const error = validateField(key, formData[key]); //Call validateField for each field
      if (error) newErrors[key] = error; //If there's an error, add it to newErrors
    });
    setErrors(newErrors); //Update the errors state with the new errors

    if (Object.keys(newErrors).length === 0) {
      if (!formData.id ) {   
      // Proceed if there are no errors  Check if there are any errors after validation
      try {
        //Get the authentication token from local storage
        const { token } = JSON.parse(localStorage.getItem("auth_user") || "{}");
        console.log("Token:", token); // Log the token for debugging

        if (!token) {
          // Check if token is available. If not, alert the user and return
          alert("Authentication token not found. Please log in.");
          return;
        }

        const postData = {
          // Prepare data for POST request to create/update post. Extract necessary data from formData
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
          categories: [formData.category], // Wrap category in an array as the backend expects it
        };

        const apiUrl = `${import.meta.env.VITE_API_URL}/api/posts`;

        const method = "POST";

        const response = await fetch(apiUrl, {
          //Send API request to create/update post
          method, //HTTP method (PUT or POST)
          headers: {
            "Content-Type": "application/json", //Indicate JSON content type
            Authorization: `Bearer ${token}`, // Include Authorization header with token
          },
          body: JSON.stringify(postData), //Convert postData to JSON string
        });

        if (!response.ok) {
          //Check if request was successful. Throw error if response is not ok
          throw new Error(
            `Failed to ${
              formData.id ? "update" : "create" //Display appropriate message based on action
            } the post. Please try again.`
          );
        }

        alert(`Post ${formData.id ? "updated" : "created"} successfully!`); //Alert user of success
        navigate("/"); // Navigate to the home page after successful submission
      } catch (error) {
        alert(error.message); //Display error message to user in an alert box
      }
    }
    } else {
      //Alert the user to fix errors before submitting.
      alert("Please fix the errors before publishing.");
    }
  };

  // This line starts the return statement of a functional component, likely named PostEditor.
  // It returns a JSX expression, which is a way to write HTML-like code within JavaScript.
  return (
    // This div is the main container for the post editor.
    // It uses the `styles.post_editor_container` class for styling, defined in an external CSS or styling library.
    <div className={styles.post_editor_container}>
      {/* This form element handles the submission of the post data. */}
      {/* `handleSubmit` is a function that will be executed when the form is submitted. */}
      {/* The className attribute dynamically applies styles based on the `isDarkMode` variable. */}
      {/* If `isDarkMode` is true, it adds the `styles.dark` class for dark mode styling.  */}
      {/* template literals using backticks allow embedding expressions ${} to dynamically create the class name string */}
      <form
        onSubmit={handleSubmit}
        className={`${styles.post_editor} ${isDarkMode ? styles.dark : ""}`}
      >
        {/* This div wraps the title input field and its label. */}
        <div className={styles.form_group}>
          {/* This label element is associated with the title input field. */}
          {/* The 'htmlFor' attribute connects the label to the input with the matching 'id'. */}
          {/*  ' * ' indicates this field is required */}
          <label htmlFor="title" className={styles.form_label}>
            Title *
          </label>
          {/* This is the input field for the post title. */}
          <input
            type="text" // Specifies that this is a text input field.
            id="title" // Sets the ID of the input field, connecting it to the label.
            name="title" // Sets the name of the input field, used for form submission.
            value={formData.title} // Sets the value of the input field to the 'title' property from the `formData` object (likely state).
            onChange={handleChange} // Calls the `handleChange` function whenever the input value changes.
            onBlur={handleBlur} // calls the `handleBlur` function when the input loses focus (user clicks outside the field)
            // often used for validation or saving data
            className={`${styles.input_field} ${
              errors.title ? styles.error : ""
            }`} // Dynamically adds the `styles.error` class if there's an error related to the title.
            placeholder="Enter post title..." // Displays placeholder text inside the input field when it's empty.
          />
          {/* This span displays an error message if there's an error related to the title. */}
          {errors.title && (
            //  Conditional rendering: this span is only rendered if errors.title is true (meaning an error exists)
            //  && is the short-circuiting AND operator: if the left side is false the right is not evaluated
            <span className={styles.error_message}>{errors.title}</span>
          )}
        </div>
        {/* <div className={styles.form_group}>
          <label htmlFor="author" className={styles.form_label}>
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input_field} ${
              errors.author ? styles.error : ""
            }`}
            placeholder="Enter post author..."
          />
          {errors.author && (
            <span className={styles.error_message}>{errors.author}</span>
          )}
        </div> */}
        <div className={styles.form_group}>
          {/* Label for the content input field, indicating it's required */}
          <label htmlFor="content" className={styles.form_label}>
            Content *
          </label>
          {/* RichTextEditor component for editing rich text content */}
          {/* allows formatting like bold, italics, headings, etc, unlike a simple text input  */}
          <RichTextEditor
            id="content" // connects to label, used for accessibility and styling
            name="content" // identifies the field during form submission
            value={formData.content} // sets the initial content from formData state
            onChange={(value) =>
              // updates the formData state with the new content whenever the editor content changes
              // uses a callback function to access the previous state and update only the content property.
              // ...prev spreads out all existing properties in the prev formData object to keep them unchanged
              // content: value overwrites the old content value with the new one from the editor
              setFormData((prev) => ({
                ...prev,
                content: value,
              }))
            }
            className={`${styles.input_field} ${
              errors.content ? styles.error : ""
            }`} // applies styling and error class if needed
          />
          {/* Displays an error message if there's a content error */}
          {errors.content && (
            <span className={styles.error_message}>{errors.content}</span>
          )}
        </div>
        {/* TagInput component for adding tags to the post  */}
        <TagInput
          tags={formData.tags} // passes the current tags from form data
          onChange={(tags) =>
            // Updates the formData state with new tags when they change
            setFormData((prev) => ({
              ...prev, // keep other properties of formData unchanged
              tags, // update the tags property
            }))
          }
        />
        <div className={styles.form_group}>
          <label htmlFor="category" className={styles.form_label}>
            Category
          </label>
          {/* Dropdown menu for selecting a category */}
          <select
            id="category"
            name="category"
            value={formData.category} // sets the selected value based on formData
            onChange={handleChange} // likely updates formData when the selection changes
            className={styles.input_field}
          >
            {/* predefined options for the category */}
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="travel">Travel</option>
          </select>
        </div>
        {/* <div className={styles.form_group}>
          <label htmlFor="image" className={styles.form_label}>
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg, image/png, image/gif"
            onChange={handleChange}
            className={styles.input_field}
          />
          {errors.image && (
            <span className={styles.error_message}>{errors.image}</span>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className={styles.image_preview}
            />
          )}
        </div> */}

        <div className={styles.actions}>
          {/* Submit button for the form */}
          <button type="submit" className={styles.submit_button}>
            {/* Dynamically displays button text based on whether it's a new post or an existing one being updated */}
            {/* if formData.id exists (truthy), it's an update, otherwise it's a create operation */}
            {formData.id ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>{" "}
      {/* closing tag for the form started earlier */}
      {/* this div displays a live preview of the blog post being edited */}
      <div style={{ display: "flex", flex: 1 }}>
        {" "}
        {/* flexbox styling for layout purposes */}
        {/* BlogPost component renders a preview of the post */}
        <BlogPost
          key={formData?.id} // unique key for React's rendering optimization (optional chaining ?. handles cases where formData might be null initially)
          id={formData?.id} // the ID of the post, if available
          title={formData?.title} // the title from the formData
          content={formData?.content} // the content of the post
          author={formData?.author} // the author of the post (might be pre-filled or from state)
          date={formData?.date} //  the date of the post
          image={formData?.image} // associated image for the post
          isDarkMode={isDarkMode} // passes the dark mode state to the BlogPost component
          isPreview={true} // indicates that this is a preview rendering, might affect how BlogPost behaves
        />
      </div>
    </div> // closes the post_editor_container div
  ); // closes the return statement
} // closes the PostEditor function component

// Defines PropTypes for the PostEditor component for development-time validation of the props it receives
// ensures correct data types are passed to the component, aids in debugging and maintainability
PostEditor.propTypes = {
  post: PropTypes.object, // the `post` prop (optional) should be an object if provided, likely for pre-filling the form when editing an existing post
  isDarkMode: PropTypes.bool.isRequired, // the `isDarkMode` prop is required and must be a boolean value
};

// Exports the PostEditor component to make it available for use in other parts of the application
export default PostEditor;
