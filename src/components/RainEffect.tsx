
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
        // Create lightning group to make it more realistic
        const lightningGroup = document.createElement('div');
        lightningGroup.className = 'lightning-group';
        lightningGroup.style.left = `${Math.random() * 100}vw`;
        lightningGroup.style.top = `${Math.random() * 30}vh`;
        document.body.appendChild(lightningGroup);
        
        // Create multiple lightning bolts for main strike
        for (let i = 0; i < 4; i++) {
          const lightning = document.createElement('div');
          lightning.className = 'lightning';
          // Slightly offset each strand for a more natural look
          lightning.style.left = `${i === 0 ? 0 : (Math.random() * 5) - 2.5}px`;
          lightning.style.top = `${i === 0 ? 0 : Math.random() * 10}px`;
          lightning.style.width = `${1 + Math.random() * 4}px`;
          lightning.style.height = `${70 + Math.random() * 100}px`;
          lightning.style.opacity = `${0.7 + Math.random() * 0.3}`;
          lightning.style.filter = `blur(${0.5 + Math.random() * 2}px)`;
          lightning.style.transform = `rotate(${-5 + Math.random() * 10}deg)`;
          // Add zigzag using clip-path for more realistic lightning
          const zigzagAmount = 10;
          const points = [];
          const segmentCount = 8;
          
          // Generate zigzag points
          for (let j = 0; j <= segmentCount; j++) {
            const progress = j / segmentCount;
            const horizontalOffset = j % 2 === 0 ? 
              -zigzagAmount + Math.random() * zigzagAmount * 0.5 : 
              zigzagAmount + Math.random() * zigzagAmount * 0.5;
            points.push(`${50 + horizontalOffset}% ${progress * 100}%`);
          }
          
          lightning.style.clipPath = `polygon(${points.join(', ')})`;
          lightningGroup.appendChild(lightning);

          // Create 2-3 branches for main lightning
          if (i < 2) {
            const branchCount = 1 + Math.floor(Math.random() * 3);
            for (let b = 0; b < branchCount; b++) {
              const branch = document.createElement('div');
              branch.className = 'lightning-branch';
              // Branch starts at random position along main bolt
              const branchStart = 20 + Math.random() * 60;
              branch.style.top = `${branchStart}%`;
              branch.style.left = `${lightning.style.left}`;
              branch.style.width = `${1 + Math.random() * 2}px`;
              branch.style.height = `${20 + Math.random() * 40}px`;
              branch.style.opacity = lightning.style.opacity;
              branch.style.filter = lightning.style.filter;
              // Branches at various angles
              branch.style.transform = `rotate(${-70 + Math.random() * 140}deg)`;
              
              // Add zigzag to branches too
              const branchPoints = [];
              const branchSegments = 4;
              
              for (let j = 0; j <= branchSegments; j++) {
                const progress = j / branchSegments;
                const horizontalOffset = j % 2 === 0 ? 
                  -zigzagAmount * 0.7 + Math.random() * zigzagAmount * 0.3 : 
                  zigzagAmount * 0.7 + Math.random() * zigzagAmount * 0.3;
                branchPoints.push(`${50 + horizontalOffset}% ${progress * 100}%`);
              }
              
              branch.style.clipPath = `polygon(${branchPoints.join(', ')})`;
              lightningGroup.appendChild(branch);
            }
          }
        }

        setTimeout(() => {
          lightningGroup.remove();
        }, 200 + Math.random() * 100);
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
