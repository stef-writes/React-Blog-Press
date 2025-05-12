// Import necessary hooks from React library
import { useEffect, useCallback } from 'react';

// Define the PerformanceMonitor functional component
function PerformanceMonitor() {
    // Use useCallback hook to memoize the performance measurement function, preventing unnecessary re-renders
  const measurePerformance = useCallback(() => {
        // Check if the browser supports the Performance API
    if (window.performance) {
            // Get navigation timing data
      const navigation = performance.getEntriesByType('navigation')[0];
            // Get paint timing data
      const paintEntries = performance.getEntriesByType('paint');

            // Log navigation timing data to the console
      console.log('Navigation Timing:', {
        DNS: navigation.domainLookupEnd - navigation.domainLookupStart, // Calculate DNS lookup time
        TLS: navigation.connectEnd - navigation.connectStart, // Calculate TLS handshake time
        TTFB: navigation.responseStart - navigation.requestStart, // Calculate Time to First Byte
        DOMContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart, // Calculate DOMContentLoaded time
        Load: navigation.loadEventEnd - navigation.navigationStart // Calculate page load time
      });

            // Log paint timing data to the console
      console.log('Paint Timing:', {
        FP: paintEntries.find(entry => entry.name === 'first-paint')?.startTime, // Get First Paint time
        FCP: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime // Get First Contentful Paint time
      });
    }
        // The empty dependency array ensures that this function is only created once
  }, []);

    // Use useEffect hook to add and remove the 'load' event listener
  useEffect(() => {
        // Add 'load' event listener to measure performance after the page has fully loaded
    window.addEventListener('load', measurePerformance);
        // Return a cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener('load', measurePerformance);
        // Add measurePerformance to the dependency array to ensure the listener is updated when the function changes
  }, [measurePerformance]);

  // This component doesn't render anything visually
  return null;
}


// Export the PerformanceMonitor component as the default export
export default PerformanceMonitor;
