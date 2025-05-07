
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Info, Gamepad } from "lucide-react";

const Navigation = () => {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Link to="/about">
        <Button variant="outline" className="border border-[#00ff00]/30 bg-black/40 text-[#00ff00] hover:bg-black/60 hover:text-[#00ff00] hover:border-[#00ff00]/50 backdrop-blur-sm">
          <Info className="w-4 h-4 mr-2" />
          About
        </Button>
      </Link>
      <Link to="/game">
        <Button variant="outline" className="border border-[#00ff00]/30 bg-black/40 text-[#00ff00] hover:bg-black/60 hover:text-[#00ff00] hover:border-[#00ff00]/50 backdrop-blur-sm">
          <Gamepad className="w-4 h-4 mr-2" />
          Game
        </Button>
      </Link>
    </div>
  );
};

export default Navigation;
