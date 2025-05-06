
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TiltCard from "@/components/TiltCard";
import RainEffect from "@/components/RainEffect";

const About = () => {
  React.useEffect(() => {
    document.body.classList.add("cursor-custom");
    return () => {
      document.body.classList.remove("cursor-custom");
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden bg-black">
      <RainEffect />
      <div className="absolute top-4 left-4 z-30">
        <Button variant="outline" className="text-white border-[#00ff00] hover:bg-[#00ff00]/20">
          <Link to="/" state={{ fromPage: "about" }}>Home</Link>
        </Button>
      </div>
      
      <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full max-w-2xl mb-4">
        <h1 className="text-4xl font-bold mb-6 text-[#00ff00] glow">About Me</h1>
        
        <div className="space-y-6 text-left">
          <p>
            Hey there! I'm Dez, a 19-year-old from Germany with a passion for technology and creativity.
          </p>
          
          <p>
            I spend most of my time coding, designing, and exploring new digital frontiers. When I'm not in front of a computer, you might find me enjoying music or hanging out with friends.
          </p>
          
          <p>
            My interests include web development, game design, electronic music production, and discovering new technologies. I believe in continuous learning and pushing the boundaries of what's possible through digital innovation.
          </p>
          
          <p>
            Feel free to connect with me through any of my social links on the home page. I'm always open to collaborations and meeting new people who share similar interests!
          </p>
        </div>
        
        <div className="mt-8">
          <Button variant="outline" className="text-white border-[#00ff00] hover:bg-[#00ff00]/20">
            <Link to="/" state={{ fromPage: "about" }}>Back to Home</Link>
          </Button>
        </div>
      </TiltCard>
    </div>
  );
};

export default About;
