// Import the memo function from React for performance optimization
import { memo } from 'react';
// Import PropTypes for prop type validation
import PropTypes from 'prop-types';
// Import the CSS styles for the Skeleton component
import './Skeleton.css';

// Define the Skeleton component as a memoized functional component
const Skeleton = memo(function Skeleton({
  width, // Prop for the width of the skeleton
  height, // Prop for the height of the skeleton
  variant = 'rectangular', // Prop for the variant of the skeleton, defaults to 'rectangular'
  animation = 'wave' // Prop for the animation of the skeleton, defaults to 'wave'
}) {
  // Render the component JSX
  return (
    // Container div with dynamically generated class names and inline styles
    <div
      className={`skeleton skeleton--${variant} skeleton--${animation}`} // Generate class names based on variant and animation props
      style={{
        width: typeof width === 'number' ? `${width}px` : width, // Set width based on prop type, adding 'px' if it's a number
        height: typeof height === 'number' ? `${height}px` : height // Set height based on prop type, adding 'px' if it's a number
      }}
    >
            {/* Inner div for the animation effect */}
      <div className="skeleton__animation" />
    </div>
  );
});

// Define propTypes for the Skeleton component
Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Width can be a number or a string
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Height can be a number or a string
  variant: PropTypes.oneOf(['rectangular', 'circular', 'text']), // Variant must be one of the specified values
  animation: PropTypes.oneOf(['pulse', 'wave', 'none']) // Animation must be one of the specified values
};

// Export the Skeleton component as the default export
export default Skeleton;
