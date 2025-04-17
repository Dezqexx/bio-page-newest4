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
        {main: '#00ff00', glow: '#39FF14'},
        {main: '#0FFF50', glow: '#00FF00'},
        {main: '#7CFC00', glow: '#39FF14'}
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

      const segments = 4 + Math.floor(Math.random() * 4);
      let currentTop = 0;
      let prevAngle = 0;

      for (let i = 0; i < segments; i++) {
        const segment = document.createElement('div');
        segment.className = 'lightning-segment';
        segment.style.top = `${currentTop}px`;
        
        const angleVariation = 15 + Math.random() * 25;
        const newAngle = prevAngle > 0 ? -angleVariation : angleVariation;
        prevAngle = newAngle;
        
        segment.style.left = `${-15 + Math.random() * 30}px`;
        
        const heightFactor = i < segments / 2 ? 1 : 1.5;
        segment.style.height = `${(40 + Math.random() * 80) * heightFactor}px`;
        
        segment.style.transform = `rotate(${newAngle}deg)`;
        segment.style.width = `${2 + Math.random() * 2}px`;
        mainBolt.appendChild(segment);
        
        currentTop += parseInt(segment.style.height) * 0.85;
        
        const branchCount = Math.random() < 0.6 ? 1 + Math.floor(Math.random() * 2) : 0;
        
        for (let j = 0; j < branchCount; j++) {
          const branch = document.createElement('div');
          branch.className = 'lightning-branch';
          branch.style.top = `${Math.random() * parseInt(segment.style.height) * 0.8}px`;
          branch.style.left = '0';
          branch.style.height = `${15 + Math.random() * 40}px`;
          
          const branchAngle = newAngle > 0 ? 
            -30 - Math.random() * 60 : 
            30 + Math.random() * 60;
          
          branch.style.transform = `rotate(${branchAngle}deg)`;
          branch.style.width = `${1 + Math.random() * 1.5}px`;
          segment.appendChild(branch);
          
          if (Math.random() < 0.3) {
            const subBranch = document.createElement('div');
            subBranch.className = 'lightning-branch';
            subBranch.style.top = `${parseInt(branch.style.height) * 0.6}px`;
            subBranch.style.left = '0';
            subBranch.style.height = `${10 + Math.random() * 20}px`;
            subBranch.style.transform = `rotate(${-branchAngle * 0.7}deg)`;
            subBranch.style.width = `${1 + Math.random() * 0.5}px`;
            branch.appendChild(subBranch);
          }
        }
      }

      const flashIntensity = 0.1 + Math.random() * 0.15;
      const flash = document.createElement('div');
      flash.className = 'lightning-flash';
      
      // Change flash background to neon green with varying intensity
      flash.style.background = `rgba(57, 255, 20, ${flashIntensity})`; // Neon green color
      
      document.body.appendChild(flash);
      
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
          flash.style.opacity = `${flashIntensity * 0.3}`;
          setTimeout(() => {
            flash.style.opacity = '0';
          }, 50);
        }, 50);
      }, 50);
      
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
