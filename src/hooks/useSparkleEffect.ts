
import { useEffect } from 'react';

const useSparkleEffect = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.8) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${e.pageX}px`;
        sparkle.style.top = `${e.pageY}px`;
        // Update sparkle color to neon green
        sparkle.style.background = '#39FF14'; // Bright neon green
        sparkle.style.boxShadow = '0 0 4px #00FF00, 0 0 8px #7CFC00, 0 0 12px #39FF14';
        document.body.appendChild(sparkle);

        setTimeout(() => {
          sparkle.remove();
        }, 800);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
};

export default useSparkleEffect;
