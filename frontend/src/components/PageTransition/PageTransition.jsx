// Import the motion component from the framer-motion library for animation
import { motion } from 'framer-motion';
// Import PropTypes for prop type validation
import PropTypes from 'prop-types';

// Define animation variants for page transitions
const pageVariants = {
  initial: { // Initial state: page is hidden off-screen to the left
    opacity: 0, // Initial opacity is 0 (invisible)
    x: -20 // Initial x position is -20px
  },
  enter: { // Enter state: page slides in from the left and becomes visible
    opacity: 1, // Opacity becomes 1 (fully visible)
    x: 0, // X position becomes 0 (centered)
    transition: { // Transition settings for the enter animation
      duration: 0.3, // Animation duration of 0.3 seconds
      ease: 'easeOut' // Easing function for a smooth start and end
    }
  },
  exit: { // Exit state: page slides out to the right and becomes invisible
    opacity: 0, // Opacity becomes 0 (invisible)
    x: 20, // X position becomes 20px
    transition: { // Transition settings for the exit animation
      duration: 0.2, // Animation duration of 0.2 seconds
      ease: 'easeIn' // Easing function for a smooth start and end
    }
  }
};

// Define the PageTransition functional component
function PageTransition({ children }) { // Receives children prop to render the page content
    // Render the component JSX
  return (
    // Use motion.div to animate the page transition
    <motion.div
      initial="initial" // Set the initial animation state to "initial"
      animate="enter" // Set the animation state to "enter" when the component mounts
      exit="exit" // Set the animation state to "exit" when the component unmounts
      variants={pageVariants} // Use the defined pageVariants for the animation
    >
      {children} {/* Render the children (page content) within the animated div */}
    </motion.div>
  );
}

// Define propTypes for the PageTransition component
PageTransition.propTypes = {
  children: PropTypes.node.isRequired // Children prop is required and must be a React node
};

// Export the PageTransition component as the default export
export default PageTransition;
