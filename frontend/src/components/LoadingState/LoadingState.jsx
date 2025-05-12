// Import the Skeleton component for placeholder loading
import Skeleton from '../Skeleton/Skeleton';
// Import CSS styles for the component
import styles from './LoadingState.module.css';

// Define the PostSkeleton component to represent a skeleton loading state for a single post
function PostSkeleton() {
    // Render the component JSX
  return (
        // Container for the post skeleton
    <div className={styles.postSkeleton}>
            {/* Header section of the post skeleton */}
      <div className={styles.postSkeleton__header}>
                {/* Circular skeleton for the avatar */}
        <Skeleton variant="circular" width={40} height={40} />
                {/* Meta information section (author, date) */}
        <div className={styles.postSkeleton__meta}>
                    {/* Text skeleton for the author's name */}
          <Skeleton variant="text" width={120} height={20} />
                    {/* Text skeleton for the date */}
          <Skeleton variant="text" width={80} height={16} />
        </div>
      </div>

            {/* Rectangular skeleton for the post's main content area */}
      <Skeleton variant="rectangular" width="100%" height={200} />

            {/* Content section with multiple lines of text */}
      <div className={styles.postSkeleton__content}>
                {/* Text skeletons for content lines */}
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="95%" height={20} />
        <Skeleton variant="text" width="85%" height={20} />
      </div>
    </div>
  );
}


// Define the LoadingState functional component to display multiple post skeletons
export default function LoadingState({ count = 3 }) { // Receives a count prop to determine the number of skeletons to display, defaults to 3
    // Render the component JSX
  return (
        // Container for the loading state
    <div className={styles.loadingState}>
            {/* Render multiple PostSkeleton components based on the count prop */}
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} /> // Use a unique key for each PostSkeleton component
      ))}
    </div>
  );
}
