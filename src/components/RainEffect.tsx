
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
      const lightning = document.createElement('div');
      lightning.className = 'lightning';
      lightning.style.left = `${Math.random() * 100}vw`;
      lightning.style.height = `${Math.random() * 30 + 70}vh`;
      
      // Create the main bolt path with SVG for more natural appearance
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      // Generate a more natural zigzag path
      let pathData = "M50,0 ";
      let x = 50;
      let y = 0;
      const segments = 6 + Math.floor(Math.random() * 6);
      const height = parseInt(lightning.style.height);
      
      for (let i = 1; i <= segments; i++) {
        // Create more natural, thinner lightning pattern like in the reference image
        x += Math.random() * 30 - 15;
        y = (i / segments) * height;
        pathData += `L${x},${y} `;
        
        // Add occasional branch
        if (Math.random() < 0.4 && i > 1 && i < segments - 1) {
          const branchX = x + (Math.random() * 30 - 15);
          const branchY = y + (Math.random() * 15 - 5);
          pathData += `M${x},${y} L${branchX},${branchY} M${x},${y} `;
        }
      }
      
      path.setAttribute("d", pathData);
      path.setAttribute("stroke", "#00ff00");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("filter", "drop-shadow(0 0 8px rgba(0, 255, 0, 0.8))");
      
      svg.appendChild(path);
      lightning.appendChild(svg);
      
      document.body.appendChild(lightning);
      
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
        lightning.remove();
        flash.remove();
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
