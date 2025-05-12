// Import necessary hooks from React library
import { useState, useEffect, useRef } from 'react';
// Import PropTypes for prop type validation
import PropTypes from 'prop-types';
// Import CSS styles for the component
import './OptimizedImage.css';

// Define the OptimizedImage functional component
function OptimizedImage({
  src, // Image source URL
  alt, // Alt text for the image
  width, // Image width
  height, // Image height
  loading = 'lazy', // Loading attribute, defaults to 'lazy'
  sizes = '100vw' // Sizes attribute, defaults to '100vw'
}) {
    // Initialize state for loading and error status using useState hook
  const [isLoaded, setIsLoaded] = useState(false); // Initially set to false, indicating the image is not loaded
  const [isError, setIsError] = useState(false); // Initially set to false, indicating no error
    // Create a ref to the image element using useRef hook
  const imgRef = useRef(null);

    // Use useEffect hook to handle lazy loading with Intersection Observer
  useEffect(() => {
        // Create a new IntersectionObserver instance
    const observer = new IntersectionObserver(
            // Callback function to be executed when the observed element intersects the viewport
      (entries) => {
                // Loop through each entry in the entries array
        entries.forEach(entry => {
                    // Check if the entry is intersecting the viewport
          if (entry.isIntersecting) {
                        // Get the image element from the entry
            const img = entry.target;
                        // Set the src attribute of the image to trigger loading
            img.src = src;
                        // Stop observing the image element after it's loaded
            observer.unobserve(img);
          }
        });
      },
            // Options for the IntersectionObserver
      {
        rootMargin: '50px' // Add a margin of 50px around the viewport to trigger loading earlier
      }
    );

        // Start observing the image element if it exists
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

        // Cleanup function to unobserve the image element when the component unmounts or the src prop changes
    return () => {
            //Stop observing the image if there's a reference
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
        // Add src to the dependency array to re-run the effect when the src prop changes
  }, [src]);

    // Function to handle image load event
  const handleLoad = () => setIsLoaded(true); // Set isLoaded to true when the image is loaded

    // Function to handle image error event
  const handleError = () => setIsError(true); // Set isError to true when there is an error loading the image

  // Render the component JSX
  return (
        // Container for the optimized image
    <div
      className={`optimized-image ${isLoaded ? 'is-loaded' : ''}`} // Apply "is-loaded" class when the image is loaded
      style={{ aspectRatio: `${width}/${height}` }} // Maintain aspect ratio based on width and height props
    >
            {/* Render placeholder while the image is loading and no error occurred*/}
      {!isLoaded && !isError && (
        <div className="optimized-image__placeholder" />
      )}


            {/* Conditionally render error message or image element */}
      {isError ? ( // If there is an error
        <div className="optimized-image__error"> {/* Display error message */}
          Failed to load image
        </div>
      ) : ( // If no error
        <img
          ref={imgRef} // Set the ref to the image element
          alt={alt} // Set alt text
          width={width} // Set width
          height={height} // Set height
          onLoad={handleLoad} // Call handleLoad function when the image loads successfully
          onError={handleError} // Call handleError function when there's an error loading the image
          loading={loading} // Set loading attribute
          sizes={sizes} // Set sizes attribute
          className="optimized-image__img" // Apply image styles
        />
      )}
    </div>
  );
}


// Define PropTypes for the OptimizedImage component
OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired, // src prop is required and must be a string
  alt: PropTypes.string.isRequired, // alt prop is required and must be a string
  width: PropTypes.number.isRequired, // width prop is required and must be a number
  height: PropTypes.number.isRequired, // height prop is required and must be a number
  loading: PropTypes.oneOf(['lazy', 'eager']), // loading prop must be one of 'lazy' or 'eager'
  sizes: PropTypes.string // sizes prop is optional and must be a string
};


// Export the OptimizedImage component as the default export
export default OptimizedImage;
