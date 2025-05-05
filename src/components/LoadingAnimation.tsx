
import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        <div className="w-20 h-20 border-4 border-[#00ff00]/50 border-t-[#00ff00] rounded-full animate-spin mb-4"></div>
        <div className="w-32 h-2 bg-[#00ff00]/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#00ff00] rounded-full animate-pulse"></div>
        </div>
        <div className="text-[#00ff00] mt-4 text-xl font-bold">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
