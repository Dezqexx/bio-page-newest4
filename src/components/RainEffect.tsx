
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
      // Randomly choose lightning color - sometimes blue-white, sometimes with a hint of purple
      const colorTypes = [
        {main: '#EFFFFF', glow: '#0EA5E9'}, // Blue-white
        {main: '#F9FEFF', glow: '#1EAEDB'}, // Bright white-blue
        {main: '#F5F5FF', glow: '#8B5CF6'}, // White with purple hint
      ];
      const colorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];
      
      // Create main lightning bolt with improved zigzag pattern
      const mainBolt = document.createElement('div');
      mainBolt.className = 'lightning-main';
      mainBolt.style.left = `${Math.random() * 100}vw`;
      mainBolt.style.top = '0';
      
      // Apply color styles directly instead of using attributes
      const segmentStyle = document.createElement('style');
      segmentStyle.textContent = `
        #lightning-${Date.now()} .lightning-segment {
          background: ${colorType.main};
          box-shadow: 0 0 5px ${colorType.main}, 0 0 10px ${colorType.glow}, 0 0 20px ${colorType.glow}80;
        }
        #lightning-${Date.now()} .lightning-branch {
          background: ${colorType.main};
          box-shadow: 0 0 4px ${colorType.main}, 0 0 8px ${colorType.glow}, 0 0 12px ${colorType.glow}60;
        }
      `;
      document.head.appendChild(segmentStyle);
      
      // Add unique ID for targeting
      const uniqueId = `lightning-${Date.now()}`;
      mainBolt.id = uniqueId;
      document.body.appendChild(mainBolt);

      // Create 4-7 segments for zigzag effect (more segments for realism)
      const segments = 4 + Math.floor(Math.random() * 4);
      let currentTop = 0;
      let prevAngle = 0; // Track previous angle for more natural zigzag
      
      for (let i = 0; i < segments; i++) {
        const segment = document.createElement('div');
        segment.className = 'lightning-segment';
        segment.style.top = `${currentTop}px`;
        
        // More natural zigzag by accounting for previous angle
        const angleVariation = 15 + Math.random() * 25; // More pronounced angles
        const newAngle = prevAngle > 0 ? -angleVariation : angleVariation;
        prevAngle = newAngle;
        
        segment.style.left = `${-15 + Math.random() * 30}px`; // Random horizontal offset
        
        // Variable segment heights - shorter near the top, longer near the bottom
        const heightFactor = i < segments / 2 ? 1 : 1.5;
        segment.style.height = `${(40 + Math.random() * 80) * heightFactor}px`;
        
        segment.style.transform = `rotate(${newAngle}deg)`;
        segment.style.width = `${2 + Math.random() * 2}px`; // Variable width
        mainBolt.appendChild(segment);
        
        currentTop += parseInt(segment.style.height) * 0.85; // Slight overlap
        
        // Add branches with 60% probability for each segment (more branches)
        const branchCount = Math.random() < 0.6 ? 1 + Math.floor(Math.random() * 2) : 0;
        
        for (let j = 0; j < branchCount; j++) {
          const branch = document.createElement('div');
          branch.className = 'lightning-branch';
          branch.style.top = `${Math.random() * parseInt(segment.style.height) * 0.8}px`;
          branch.style.left = '0';
          branch.style.height = `${15 + Math.random() * 40}px`;
          
          // Branches tend to go opposite of segment angle
          const branchAngle = newAngle > 0 ? 
            -30 - Math.random() * 60 : 
            30 + Math.random() * 60;
          
          branch.style.transform = `rotate(${branchAngle}deg)`;
          branch.style.width = `${1 + Math.random() * 1.5}px`; // Thinner than main segment
          segment.appendChild(branch);
          
          // Sometimes add sub-branches (forking lightning)
          if (Math.random() < 0.3) {
            const subBranch = document.createElement('div');
            subBranch.className = 'lightning-branch';
            subBranch.style.top = `${parseInt(branch.style.height) * 0.6}px`;
            subBranch.style.left = '0';
            subBranch.style.height = `${10 + Math.random() * 20}px`;
            subBranch.style.transform = `rotate(${-branchAngle * 0.7}deg)`;
            subBranch.style.width = `${1 + Math.random() * 0.5}px`; // Even thinner
            branch.appendChild(subBranch);
          }
        }
      }

      // Enhanced flash effect for the sky - multiple flashes
      const flashIntensity = 0.1 + Math.random() * 0.15; // Variable intensity
      const flash = document.createElement('div');
      flash.className = 'lightning-flash';
      flash.style.background = `rgba(255, 255, 255, ${flashIntensity})`;
      document.body.appendChild(flash);
      
      // Multiple flash effect (primary + echo)
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
          flash.style.opacity = `${flashIntensity * 0.3}`;
          setTimeout(() => {
            flash.style.opacity = '0';
          }, 50);
        }, 50);
      }, 50);
      
      // Remove elements after animation completes
      setTimeout(() => {
        mainBolt.remove();
        flash.remove();
        segmentStyle.remove(); // Clean up style element
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
