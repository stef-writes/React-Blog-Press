// Import necessary components from framer-motion library
import { motion, AnimatePresence } from 'framer-motion';
// Import PropTypes for prop type validation
import PropTypes from 'prop-types';
// Import CSS styles for the component
import styles from './AnimatedList.module.css';

// Define animation variants for the list
const listVariants = {
  hidden: { opacity: 0 }, // Initial state: list is hidden (opacity 0)
  visible: { // Visible state: list fades in
    opacity: 1, // Opacity becomes 1 (fully visible)
    transition: { // Transition settings for the list animation
      staggerChildren: 0.1, // Stagger the animation of each child item by 0.1 seconds
    },
  },
};

// Define animation variants for the list items
const itemVariants = {
  hidden: { // Initial state: item is hidden, positioned slightly below its final position
    opacity: 0, // Initial opacity is 0 (invisible)
    y: 20, // Initial vertical position is 20px down
  },
  visible: { // Visible state: item fades in and moves up to its final position
    opacity: 1, // Opacity becomes 1 (fully visible)
    y: 0, // Vertical position becomes 0
    transition: {  // Transition settings for the item animation
      duration: 0.3, // Animation duration of 0.3 seconds
      ease: 'easeOut', // Easing function for a smooth start and end
    },
  },
    // Exit state: item fades out and moves to the left
  exit: {
    opacity: 0, // Opacity becomes 0 (invisible)
    x: -20, // Move item 20px to the left
    transition: { // Transition settings for the exit animation
      duration: 0.2, // Animation duration of 0.2 seconds
    },
  },
};

// Define the AnimatedList functional component
function AnimatedList({ items, renderItem }) { // Receives items and renderItem props
    //items - an array of items to be rendered in the list. Each item should have a unique id property.
    //renderItem - a function that takes an item from the items array and its index as arguments, and returns a React element to render for that item.  
      
  return (
        // Use motion.ul to animate the list
    <motion.ul
      className={styles.animatedList} // Apply styles for the animated list
      variants={listVariants} // Use the defined listVariants for the list animation
      initial="hidden" // Set the initial animation state to "hidden"
      animate="visible" // Set the animation state to "visible" when the component mounts
    >
            {/* Use AnimatePresence to animate entering and exiting of list items */}
      <AnimatePresence mode="popLayout"> {/* Set mode to "popLayout" to animate layout changes */}
        {/* Map over the items array to render each item */}
        {items.map((item, index) => (
          <motion.li
            key={item.id} // Use a unique key for each list item (required by React)
            variants={itemVariants} // Use the defined itemVariants for the item animation
            layout // Enable layout animations for the item
            exit="exit" // Set the exit animation state to "exit" when the item is removed
            className={styles.animatedList__item}
          >
                        {/* Call the renderItem function to render the content of the list item */}
            {renderItem(item, index)}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

// Define propTypes for the AnimatedList component
AnimatedList.propTypes = {
    // Validate that items is a required array of objects, each with a required id property that can be a string or number
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
    // Validate that renderItem is a required function
  renderItem: PropTypes.func.isRequired,
};

// Export the AnimatedList component as the default export
export default AnimatedList;
