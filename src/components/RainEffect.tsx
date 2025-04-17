
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
        createLightning();
      }

      setTimeout(() => {
        drop.remove();
      }, 2000);
    };

    const createLightning = () => {
      // Create main lightning bolt with zigzag pattern
      const mainBolt = document.createElement('div');
      mainBolt.className = 'lightning-main';
      mainBolt.style.left = `${Math.random() * 100}vw`;
      mainBolt.style.top = '0';
      document.body.appendChild(mainBolt);

      // Create 3-5 segments for zigzag effect
      const segments = 3 + Math.floor(Math.random() * 3);
      let currentTop = 0;
      
      for (let i = 0; i < segments; i++) {
        const segment = document.createElement('div');
        segment.className = 'lightning-segment';
        segment.style.top = `${currentTop}px`;
        segment.style.left = `${-15 + Math.random() * 30}px`; // Random horizontal offset
        segment.style.height = `${50 + Math.random() * 100}px`;
        segment.style.transform = `rotate(${-20 + Math.random() * 40}deg)`;
        mainBolt.appendChild(segment);
        
        currentTop += parseInt(segment.style.height);
        
        // Add branches with 40% probability for each segment
        if (Math.random() < 0.4) {
          const branch = document.createElement('div');
          branch.className = 'lightning-branch';
          branch.style.top = `${20 + Math.random() * 30}px`;
          branch.style.left = '0';
          branch.style.height = `${20 + Math.random() * 50}px`;
          branch.style.transform = `rotate(${-70 + Math.random() * 140}deg)`;
          segment.appendChild(branch);
        }
      }

      // Flash effect for the sky
      const flash = document.createElement('div');
      flash.className = 'lightning-flash';
      document.body.appendChild(flash);
      
      // Remove elements after animation completes
      setTimeout(() => {
        mainBolt.remove();
        flash.remove();
      }, 300);
    };

    const rainInterval = setInterval(() => {
      // Create multiple raindrops per interval for more density
      for (let i = 0; i < 3; i++) {
        createRainDrop();
      }
    }, 50);

    return () => clearInterval(rainInterval);
  }, []);

  return null;
};

export default RainEffect;
