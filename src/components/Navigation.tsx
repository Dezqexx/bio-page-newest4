
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="fixed top-4 right-4 z-20 flex gap-2">
      <Link 
        to="/about" 
        state={{ entered: true }}
        className="bg-black/50 border-2 border-[#00ff00]/50 text-[#00ff00] px-4 py-2 rounded hover:bg-[#00ff00]/10 transition-all"
      >
        About
      </Link>
      <Link 
        to="/game" 
        state={{ entered: true }}
        className="bg-black/50 border-2 border-[#00ff00]/50 text-[#00ff00] px-4 py-2 rounded hover:bg-[#00ff00]/10 transition-all"
      >
        Game
      </Link>
    </div>
  );
};

export default Navigation;
