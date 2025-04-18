
import React, { useEffect } from 'react';

const RainEffect = () => {
  useEffect(() => {
    const createRainDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random() * 100}vw`;
      drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
      document.body.appendChild(drop);

      if (Math.random() < 0.02) {
        createLightning();
      }

      setTimeout(() => {
        drop.remove();
      }, 2000);
    };

    const createLightning = () => {
      const colorTypes = [
        {main: '#9b87f5', glow: '#8B5CF6'},
        {main: '#A78BFA', glow: '#9b87f5'},
        {main: '#8B5CF6', glow: '#7C3AED'}
      ];
      const colorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];
      
      const mainBolt = document.createElement('div');
      mainBolt.className = 'lightning-main';
      mainBolt.style.left = `${Math.random() * 100}vw`;
      mainBolt.style.top = '0';
      
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
      
      const uniqueId = `lightning-${Date.now()}`;
      mainBolt.id = uniqueId;
      document.body.appendChild(mainBolt);

      // More natural, less rigid lightning pattern
      const segments = 3 + Math.floor(Math.random() * 4);
      let currentTop = 0;
      let prevOffsetX = 0;

      for (let i = 0; i < segments; i++) {
        const segment = document.createElement('div');
        segment.className = 'lightning-segment';
        segment.style.top = `${currentTop}px`;
        
        // Create more natural zig-zag pattern
        // Less extreme angles and more gradual direction changes
        const offsetX = prevOffsetX + (-20 + Math.random() * 40);
        prevOffsetX = offsetX;
        
        segment.style.left = `${offsetX}px`;
        
        // Varying segment thickness and length for more natural look
        const segmentWidth = 2 + Math.random() * 2;
        const heightFactor = 1 + Math.random() * 0.5;
        segment.style.height = `${(40 + Math.random() * 60) * heightFactor}px`;
        segment.style.width = `${segmentWidth}px`;
        
        // Smoother, less severe angles
        const angle = -10 + Math.random() * 20;
        segment.style.transform = `rotate(${angle}deg)`;
        
        mainBolt.appendChild(segment);
        
        currentTop += parseInt(segment.style.height) * 0.8;
        
        // More randomized branch generation
        const branchCount = Math.random() < 0.7 ? 1 + Math.floor(Math.random() * 2) : 0;
        
        for (let j = 0; j < branchCount; j++) {
          const branch = document.createElement('div');
          branch.className = 'lightning-branch';
          branch.style.top = `${Math.random() * parseInt(segment.style.height) * 0.7}px`;
          branch.style.left = '0';
          
          // Shorter, more natural branches
          branch.style.height = `${10 + Math.random() * 30}px`;
          
          // Less extreme angles for branches
          const branchAngle = -25 + Math.random() * 50;
          
          branch.style.transform = `rotate(${branchAngle}deg)`;
          branch.style.width = `${segmentWidth * 0.7}px`; // Thinner than main bolt
          segment.appendChild(branch);
          
          // Occasional sub-branches for more natural fractal-like appearance
          if (Math.random() < 0.4) {
            const subBranch = document.createElement('div');
            subBranch.className = 'lightning-branch';
            subBranch.style.top = `${parseInt(branch.style.height) * 0.5}px`;
            subBranch.style.left = '0';
            subBranch.style.height = `${5 + Math.random() * 15}px`;
            subBranch.style.transform = `rotate(${-branchAngle * 0.6}deg)`;
            subBranch.style.width = `${segmentWidth * 0.5}px`; // Even thinner
            branch.appendChild(subBranch);
          }
        }
      }

      // Subtle flash effect
      const flashIntensity = 0.05 + Math.random() * 0.1;
      const flash = document.createElement('div');
      flash.className = 'lightning-flash';
      flash.style.background = `rgba(57, 255, 20, ${flashIntensity})`;
      document.body.appendChild(flash);
      
      // More natural flash timing
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
          flash.style.opacity = `${flashIntensity * 0.3}`;
          setTimeout(() => {
            flash.style.opacity = '0';
          }, 50);
        }, 50);
      }, 50);
      
      // Clean up after animation
      setTimeout(() => {
        mainBolt.remove();
        flash.remove();
        segmentStyle.remove();
      }, 300);
    };

    const rainInterval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        createRainDrop();
      }
    }, 50);

    return () => clearInterval(rainInterval);
  }, []);

  return null;
};

export default RainEffect;
