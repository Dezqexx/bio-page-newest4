
import { useState, useEffect } from 'react';

export const useViewCount = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get current count from localStorage
    const storedCount = localStorage.getItem('siteViewCount');
    const initialCount = storedCount ? parseInt(storedCount, 10) : 0;
    
    // Increment the count
    const newCount = initialCount + 1;
    
    // Save back to localStorage
    localStorage.setItem('siteViewCount', newCount.toString());
    setCount(newCount);
    setLoading(false);
  }, []);

  return { count, loading };
};

export default useViewCount;
