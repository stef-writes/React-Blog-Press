// src/components/NotFound  //file path
import { useNavigate, useRouteError } from "react-router-dom"; // Import useNavigate for navigation and useRouteError to access error information.
import styles from "./NotFound.module.css"; // Import CSS styles specific to this component.

function NotFound() {
  const navigate = useNavigate(); // Get the navigate function for programmatic navigation.
  const error = useRouteError(); // Get the error object using the useRouteError hook.  This object contains information about the error that occurred.

  return (
    <div className={styles.notFound}> {/* Main container for the NotFound component */}
      <h1 className={styles.notFound__title}>Oops!</h1> {/* Title indicating an error */}
      <p className={styles.notFound__message}> {/*default error message */}
        Sorry, an unexpected error has occurred.
      </p>
      <p className={styles.notFound__error}> {/* Display the error message from the error object if available. */}
        {error?.statusText || error?.message}  
      <div className={styles.notFound__actions}> {/*buttons container*/}
        <button    //button to go back to previous page
          onClick={() => navigate(-1)}  //uses navigate(-1) to go back to the previous page in history
          className={styles.notFound__button}
        >
          Go Back
        </button>
        <button     //button to go to home page
          onClick={() => navigate("/")}   //uses navigate("/") to navigate to the home page
          className={styles.notFound__button}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;  //export the NotFound component
