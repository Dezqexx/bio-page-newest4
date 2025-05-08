
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const isGamePage = location.pathname === "/game";

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {isGamePage ? (
        <>
          <Button
            asChild
            className="bg-black border border-[#00ff00] text-[#00ff00] hover:bg-black/80 hover:text-white"
          >
            <Link to="/">
              <ArrowLeft className="mr-1 w-4 h-4" />
              Back
            </Link>
          </Button>
        </>
      ) : (
        <Button
          asChild
          className="bg-black border border-[#00ff00] text-[#00ff00] hover:bg-black/80 hover:text-white"
        >
          <Link to="/game">Game</Link>
        </Button>
      )}
    </div>
  );
};

export default Navigation;
