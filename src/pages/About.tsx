
import { Link } from "react-router-dom";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import TiltCard from "@/components/TiltCard";
import { HomeIcon } from "lucide-react";

const About = () => {
  useSparkleEffect();

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />

      <div className="flex flex-col items-center max-w-3xl w-full px-4">
        <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full">
          <h1 className="text-4xl font-bold mb-6 text-[#00ff00] glow">About Me</h1>
          
          <div className="text-[#00ff00]/90 mb-8 text-lg">
            <p className="mb-4">
              Hi there! I'm Dez, a 19-year-old developer from Germany with a passion for creating unique digital experiences.
            </p>
            <p className="mb-4">
              I enjoy coding, gaming, and listening to music. When I'm not working on projects, you can find me exploring new technologies
              or hanging out with friends on Discord.
            </p>
            <p>
              This website showcases my personal style and some of my interests. Feel free to explore and get to know more about me!
            </p>
          </div>

          <Link 
            to="/" 
            state={{ entered: true }}
            className="inline-flex items-center gap-2 bg-black/50 border-2 border-[#00ff00]/50 text-[#00ff00] px-6 py-3 rounded-lg hover:bg-[#00ff00]/10 transition-all"
          >
            <HomeIcon size={18} />
            Back to Home
          </Link>
        </TiltCard>
      </div>
    </div>
  );
};

export default About;
