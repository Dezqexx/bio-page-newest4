
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        asChild
        className="bg-black border border-[#00ff00] text-[#00ff00] hover:bg-black/80 hover:text-white"
      >
        <Link to="/game">Game</Link>
      </Button>
    </div>
  );
};

export default Navigation;
