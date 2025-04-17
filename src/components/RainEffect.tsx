
import React, { useEffect } from 'react';

const RainEffect = () => {
  useEffect(() => {
    const createRainDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random() * 100}vw`;
      drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
      document.body.appendChild(drop);

      setTimeout(() => {
        drop.remove();
      }, 2000);
    };

    const createLightning = () => {
      // Create main lightning bolt
      const lightning = document.createElement('div');
      lightning.className = 'lightning';
      
      const startX = Math.random() * 100;
      lightning.style.left = `${startX}vw`;
      lightning.style.top = `${Math.random() * 30}vh`;
      lightning.style.height = `${50 + Math.random() * 50}vh`;
      
      // Add random rotation to make it more natural
      lightning.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
      
      document.body.appendChild(lightning);
      
      // Create branches (smaller lightning bolts)
      const branchCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < branchCount; i++) {
        const branch = document.createElement('div');
        branch.className = 'lightning-branch';
        
        // Position branch relative to main bolt
        branch.style.left = `${startX + (Math.random() * 10 - 5)}vw`;
        branch.style.top = `${15 + Math.random() * 40}vh`;
        branch.style.height = `${20 + Math.random() * 30}vh`;
        branch.style.width = `${1 + Math.random() * 2}px`;
        
        // Rotate branch away from main bolt
        const rotation = Math.random() > 0.5 ? 
          10 + Math.random() * 20 : 
          -10 - Math.random() * 20;
        branch.style.transform = `rotate(${rotation}deg)`;
        
        document.body.appendChild(branch);
        
        setTimeout(() => {
          branch.remove();
        }, 200);
      }
      
      // Add flash effect
      const flash = document.createElement('div');
      flash.className = 'lightning-flash';
      document.body.appendChild(flash);
      
      setTimeout(() => {
        lightning.remove();
        flash.remove();
      }, 200);
    };

    // Rain creation interval
    const rainInterval = setInterval(() => {
      createRainDrop();
    }, 50);

    // Lightning creation interval (less frequent)
    const lightningInterval = setInterval(() => {
      if (Math.random() < 0.03) { // 3% chance for lightning
        createLightning();
        
        // Sometimes add a secondary flash after a delay
        if (Math.random() < 0.3) {
          setTimeout(() => {
            createLightning();
          }, 100 + Math.random() * 200);
        }
      }
    }, 500);

    return () => {
      clearInterval(rainInterval);
      clearInterval(lightningInterval);
    };
  }, []);

  return null;
};

export default RainEffect;
