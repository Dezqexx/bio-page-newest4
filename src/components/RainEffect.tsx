
import React, { useEffect } from 'react';

const RainEffect = () => {
  useEffect(() => {
    const createRainDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random() * 100}vw`;
      drop.style.opacity = `${0.7 + Math.random() * 0.3}`; // Higher opacity for more visibility
      drop.style.width = `${1 + Math.random() * 2}px`; // Slightly thicker rain drops
      drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
      document.body.appendChild(drop);

      // Randomly create lightning
      if (Math.random() < 0.02) { // 2% chance for lightning
        createLightning();
      }

      setTimeout(() => {
        drop.remove();
      }, 2000);
    };

    const createLightning = () => {
      // Main lightning bolt with zigzag pattern
      const mainBolt = document.createElement('div');
      mainBolt.className = 'lightning';
      
      const startX = Math.random() * 100;
      let currentX = startX;
      let currentY = -10; // Start slightly off-screen
      
      const bolt = document.createElement('div');
      bolt.className = 'lightning-path';
      bolt.style.left = `${currentX}vw`;
      bolt.style.top = `${currentY}vh`;
      document.body.appendChild(bolt);
      
      // Create zigzag pattern with multiple segments
      const segments = 5 + Math.floor(Math.random() * 4);
      const segmentHeight = 100 / segments;
      
      for (let i = 0; i < segments; i++) {
        const zigzag = document.createElement('div');
        zigzag.className = 'lightning-segment';
        
        // Calculate next position with zigzag effect
        const nextX = currentX + (Math.random() * 10 - 5);
        currentY += segmentHeight;
        
        zigzag.style.left = `${currentX}vw`;
        zigzag.style.top = `${currentY}vh`;
        zigzag.style.width = `${2 + Math.random() * 3}px`;
        zigzag.style.height = `${segmentHeight + Math.random() * 5}vh`;
        zigzag.style.opacity = `${0.8 + Math.random() * 0.2}`;
        zigzag.style.filter = `blur(${0.5 + Math.random()}px)`;
        zigzag.style.transform = `rotate(${-5 + Math.random() * 10}deg)`;
        document.body.appendChild(zigzag);
        
        currentX = nextX;
        
        // Add branch with 40% probability except for the first segment
        if (i > 0 && Math.random() < 0.4) {
          const branch = document.createElement('div');
          branch.className = 'lightning-branch';
          branch.style.left = `${currentX}vw`;
          branch.style.top = `${currentY}vh`;
          branch.style.width = `${1 + Math.random() * 1.5}px`;
          branch.style.height = `${10 + Math.random() * 25}px`;
          branch.style.opacity = `${0.6 + Math.random() * 0.4}`;
          branch.style.filter = `blur(${0.5 + Math.random()}px)`;
          branch.style.transform = `rotate(${-60 + Math.random() * 120}deg)`;
          document.body.appendChild(branch);
          
          setTimeout(() => {
            branch.remove();
          }, 150);
        }
        
        setTimeout(() => {
          zigzag.remove();
        }, 150);
      }
    };

    const rainInterval = setInterval(() => {
      // Create multiple drops at once for more density
      for (let i = 0; i < 3; i++) {
        createRainDrop();
      }
    }, 50);

    return () => clearInterval(rainInterval);
  }, []);

  return null;
};

export default RainEffect;
