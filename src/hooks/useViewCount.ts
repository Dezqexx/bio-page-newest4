
import { useState, useEffect } from 'react';

// Cooldown period in milliseconds (24 hours)
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000;

export const useViewCount = () => {
  const [viewCount, setViewCount] = useState<number>(0);
  
  useEffect(() => {
    const incrementViewCount = () => {
      // Check last visit timestamp
      const lastVisit = localStorage.getItem('lastVisit');
      const currentTime = new Date().getTime();
      
      // Get current view count from localStorage
      const storedCount = localStorage.getItem('viewCount');
      const currentCount = storedCount ? parseInt(storedCount, 10) : 0;
      
      // Only increment if first visit or cooldown period has passed
      if (!lastVisit || (currentTime - parseInt(lastVisit, 10)) > COOLDOWN_PERIOD) {
        // Increment count and save
        const newCount = currentCount + 1;
        localStorage.setItem('viewCount', newCount.toString());
        localStorage.setItem('lastVisit', currentTime.toString());
        setViewCount(newCount);
      } else {
        // Just use the existing count without incrementing
        setViewCount(currentCount);
      }
    };
    
    incrementViewCount();
  }, []);
  
  return viewCount;
};
