
import React, { useEffect } from 'react';

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
        // Create multiple lighting strands for more realistic effect
        for (let i = 0; i < 3; i++) {
          const lightning = document.createElement('div');
          lightning.className = 'lightning';
          lightning.style.left = `${Math.random() * 100}vw`;
          lightning.style.top = `${Math.random() * 50}vh`;
          lightning.style.width = `${2 + Math.random() * 3}px`;
          lightning.style.height = `${70 + Math.random() * 60}px`;
          lightning.style.opacity = `${0.7 + Math.random() * 0.3}`;
          lightning.style.filter = `blur(${1 + Math.random() * 2}px)`;
          lightning.style.transform = `rotate(${-10 + Math.random() * 20}deg)`;
          document.body.appendChild(lightning);

          // Create branching for main lightning
          if (i === 0 && Math.random() > 0.5) {
            const branch = document.createElement('div');
            branch.className = 'lightning-branch';
            branch.style.left = lightning.style.left;
            branch.style.top = `${parseInt(lightning.style.top) + 30 + Math.random() * 20}px`;
            branch.style.width = `${1 + Math.random() * 2}px`;
            branch.style.height = `${30 + Math.random() * 40}px`;
            branch.style.opacity = lightning.style.opacity;
            branch.style.filter = lightning.style.filter;
            branch.style.transform = `rotate(${-60 + Math.random() * 120}deg)`;
            document.body.appendChild(branch);
            
            setTimeout(() => {
              branch.remove();
            }, 200);
          }

          setTimeout(() => {
            lightning.remove();
          }, 200);
        }
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
