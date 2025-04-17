
import React, { useEffect } from 'react';
import { CloudLightning } from 'lucide-react';

const RainEffect = () => {
  useEffect(() => {
    const createRainDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random() * 100}vw`;
      drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
      document.body.appendChild(drop);

      // Randomly create lightning
      if (Math.random() < 0.02) { // 2% chance for lightning
        const lightning = document.createElement('div');
        lightning.className = 'lightning';
        lightning.style.left = `${Math.random() * 100}vw`;
        lightning.style.top = `${Math.random() * 50}vh`;
        document.body.appendChild(lightning);

        setTimeout(() => {
          lightning.remove();
        }, 200);
      }

      setTimeout(() => {
        drop.remove();
      }, 2000);
    };

    const rainInterval = setInterval(() => {
      createRainDrop();
    }, 50);

    return () => clearInterval(rainInterval);
  }, []);

  return null;
};

export default RainEffect;
