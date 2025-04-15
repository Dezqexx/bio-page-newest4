
import React from 'react';

interface BackgroundVideoProps {
  videoUrl: string;
}

const BackgroundVideo = ({ videoUrl }: BackgroundVideoProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-50"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default BackgroundVideo;
