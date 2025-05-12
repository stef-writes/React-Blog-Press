import { useState, useEffect } from "react"; // Import necessary React hooks for managing state and side effects.
import styles from "./Profile.module.css"; // Import CSS modules for styling.

function Profile() {
  const [profile, setProfile] = useState({
    // State variable for storing profile data, initialized with default values.
    name: "",
    email: "",
    bio: "",
    profilePicture: "",
  });

  const [isEditing, setIsEditing] = useState(false); // State variable for tracking edit mode.
  const [formData, setFormData] = useState({ ...profile }); // State variable for storing form data during editing.

  // Load profile data from localStorage on mount
  useEffect(() => {
    //this useEffect will run only once after the component is mounted
    const savedProfile = JSON.parse(localStorage.getItem("profile")) || {
      // Retrieve saved profile from localStorage or use default values.
      name: "Mrudula", //default name
      email: "mrudula@gmail.com", //default email
      bio: "A short bio about yourself", //default bio
      //default profile picture
      profilePicture:
        "https://as2.ftcdn.net/v2/jpg/01/45/36/30/1000_F_145363098_3MwMcG2uCbTRo5mAwkZr82HCi6DTkSHh.jpg", // Default image
    };
    setProfile(savedProfile); // Set the profile state with the retrieved or default data.
  }, []);

  const handleEditClick = () => {
    //function to handle edit button click
    setFormData({ ...profile }); // Populate form data with current profile data.
    setIsEditing(true); // Enable edit mode.
  };

  const handleChange = (e) => {
    //function to handle changes in the form fields
    const { name, value } = e.target; // Get the name and value of the changed input field.
    setFormData((prev) => ({
      // Update the formData state with the new value.
      ...prev,
      [name]: value, //update the corresponding field with the new value
    }));
  };

  const handleImageChange = (e) => {
    //function to handle image change
    const file = e.target.files[0]; // Get the selected file.
    if (file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      //check if the selected file is an image
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the selected image.
      setFormData((prev) => ({
        // Update the formData state with the new image URL.
        ...prev,
        profilePicture: imageUrl,
      }));
    } else {
      alert("Please upload a valid image (JPEG, PNG, GIF)."); //if selected file is not image display alert message
    }
  };

  const handleSave = () => {
    //function to handle save button click
    localStorage.setItem("profile", JSON.stringify(formData)); // Save the updated profile data to localStorage.
    setProfile(formData); // Update the profile state with the new data.
    setIsEditing(false); // Disable edit mode.
    alert("Profile updated successfully!"); //display alert message for successful updation
  };

  const handleCancel = () => {
    //function to handle cancel button click
    setIsEditing(false); // Disable edit mode.
  };

  return (
    <div className={styles.profilePage}>
      {" "}
      {/* Main container for the profile page. */}
      <h1>Profile Page</h1> {/* Heading for the profile page. */}
      <div className={styles.profileContainer}>
        {" "}
        {/* Container for profile information. */}
        <div className={styles.profilePicture}>
          {" "}
          {/* Container for profile picture. */}
          <img // Display the profile picture.
            src={profile.profilePicture || "/default-profile.png"} // Use the profile picture URL or a default image if not available.
            alt="Profile"
          />
          {isEditing && ( // Conditionally render file input for image upload in edit mode.
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif" //specify accepted file types
              onChange={handleImageChange} //call handleImageChange function when image is selected
            />
          )}
        </div>
        <div className={styles.profileDetails}>
          {" "}
          {/* Container for profile details. */}
          {!isEditing ? ( // Conditionally render profile details or form for editing.
            <>
              {" "}
              <h2>{profile.name}</h2> {/* Display profile name. */}
              <p>Email: {profile.email}</p> {/* Display profile email. */}
              <p>Bio: {profile.bio}</p> {/* Display profile bio. */}
              <button onClick={handleEditClick}>Edit Profile</button>{" "}
              {/* Button to enable edit mode. */}
            </>
          ) : (
            //if editing is enabled display form to edit profile details
            <>
              <input // Input field for editing name.
                type="text"
                name="name"
                value={formData.name} //set the value to form data
                onChange={handleChange} //call handleChange function when input value changes
                placeholder="Your Name"
              />
              <input // Input field for editing email.
                type="email"
                name="email"
                value={formData.email} //set the value to form data
                onChange={handleChange} //call handleChange function when input value changes
                placeholder="Your Email"
              />
              <textarea // Textarea field for editing bio.
                name="bio"
                value={formData.bio} //set the value to form data
                onChange={handleChange} //call handleChange function when input value changes
                placeholder="Your Bio"
              />
              <div className={styles.actionButtons}>
                {" "}
                {/* Container for action buttons. */}
                <button onClick={handleSave}>Save</button>{" "}
                {/* Button to save changes. */}
                <button onClick={handleCancel}>Cancel</button>{" "}
                {/* Button to cancel editing. */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; // Export the Profile component as the default export.
