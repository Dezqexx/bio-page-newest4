
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TiltCard from './TiltCard';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

const NeonShooterGame = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([
    { name: "Neon", score: 42, date: "2025-05-12" },
    { name: "Cyber", score: 38, date: "2025-05-11" },
    { name: "Dez", score: 35, date: "2025-05-10" },
    { name: "Glitch", score: 31, date: "2025-05-09" },
    { name: "Pixel", score: 29, date: "2025-05-08" }
  ]);
  const [showNameInput, setShowNameInput] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Start game function
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setTargets([createTarget()]);
  };

  // Create a new target
  const createTarget = (): Target => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return { id: Date.now(), x: 50, y: 50, size: 30 };

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;
    
    return {
      id: Date.now(),
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
      size: Math.floor(Math.random() * 20) + 20 // Random size between 20-40px
    };
  };

  // Handle clicking on a target
  const handleTargetClick = (id: number) => {
    setScore(prev => prev + 1);
    setTargets(prev => {
      const remaining = prev.filter(target => target.id !== id);
      return [...remaining, createTarget()];
    });
  };

  // Handle game timer
  useEffect(() => {
    if (!gameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          setShowNameInput(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive]);

  // Handle adding score to leaderboard
  const handleSaveScore = () => {
    if (!playerName.trim()) return;
    
    const newEntry: ScoreEntry = {
      name: playerName,
      score,
      date: new Date().toISOString().split('T')[0]
    };
    
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10
    
    setLeaderboard(newLeaderboard);
    setShowNameInput(false);
    setPlayerName('');
  };

  return (
    <div className="flex flex-col items-center w-full gap-6 px-4">
      <div className="flex w-full justify-between mb-4">
        <div className="text-[#00ff00] text-2xl font-bold">
          Score: {score}
        </div>
        
        <div className="text-[#00ff00] text-2xl font-bold">
          Time: {timeLeft}s
        </div>
      </div>
      
      {!gameActive && !showNameInput && (
        <Button 
          onClick={startGame}
          className="bg-black/70 border border-[#00ff00] text-[#00ff00] hover:bg-black/90 hover:text-[#00ff00] hover:border-[#00ff00]/80 transition-all"
        >
          Start Game
        </Button>
      )}
      
      {showNameInput && (
        <div className="flex flex-col items-center gap-4 text-[#00ff00]">
          <p className="text-xl">Great job! You scored {score} points.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="bg-black/70 border border-[#00ff00]/50 text-[#00ff00] rounded p-2 focus:outline-none focus:border-[#00ff00]"
              maxLength={15}
            />
            <Button 
              onClick={handleSaveScore}
              className="bg-black/70 border border-[#00ff00] text-[#00ff00] hover:bg-black/90"
            >
              Save
            </Button>
          </div>
        </div>
      )}
      
      {gameActive && (
        <div 
          ref={gameAreaRef}
          className="relative w-full h-[300px] border-2 border-[#00ff00]/50 rounded-lg backdrop-blur-sm bg-black/30 cursor-crosshair"
        >
          {targets.map(target => (
            <div
              key={target.id}
              style={{
                position: 'absolute',
                left: `${target.x}px`,
                top: `${target.y}px`,
                width: `${target.size}px`,
                height: `${target.size}px`,
                borderRadius: '50%',
                backgroundColor: '#00ff00',
                boxShadow: '0 0 15px 5px rgba(0, 255, 0, 0.5)',
                cursor: 'pointer'
              }}
              onClick={() => handleTargetClick(target.id)}
            />
          ))}
        </div>
      )}
      
      <TiltCard className="relative text-center p-4 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm max-w-[320px] w-full glow">
        <h2 className="text-2xl font-bold text-[#00ff00] mb-4">Leaderboard</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#00ff00]">Name</TableHead>
              <TableHead className="text-[#00ff00]">Score</TableHead>
              <TableHead className="text-[#00ff00]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="text-white">{entry.name}</TableCell>
                <TableCell className="text-white">{entry.score}</TableCell>
                <TableCell className="text-[#00ff00]">{entry.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TiltCard>
    </div>
  );
};

export default NeonShooterGame;
