
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface Player {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  isOnGround: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

const NeonShooterGame = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const keysRef = useRef<Set<string>>(new Set());

  const [player, setPlayer] = useState<Player>({
    x: 50,
    y: 200,
    velocityY: 0,
    isJumping: false,
    isOnGround: false
  });

  // Static platforms
  const platforms: Platform[] = [
    { x: 0, y: 280, width: 800, height: 20 }, // Ground
    { x: 150, y: 220, width: 100, height: 15 }, // Platform 1
    { x: 300, y: 160, width: 100, height: 15 }, // Platform 2
    { x: 450, y: 200, width: 80, height: 15 },  // Platform 3
    { x: 600, y: 140, width: 120, height: 15 }, // Platform 4
  ];

  // Collectible coins
  const [coins, setCoins] = useState([
    { x: 180, y: 190, collected: false },
    { x: 330, y: 130, collected: false },
    { x: 480, y: 170, collected: false },
    { x: 630, y: 110, collected: false },
    { x: 700, y: 250, collected: false },
  ]);

  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const MOVE_SPEED = 5;
  const PLAYER_SIZE = 20;

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const checkCollision = useCallback((playerX: number, playerY: number, platform: Platform) => {
    return (
      playerX < platform.x + platform.width &&
      playerX + PLAYER_SIZE > platform.x &&
      playerY < platform.y + platform.height &&
      playerY + PLAYER_SIZE > platform.y
    );
  }, []);

  const updateGame = useCallback(() => {
    if (!gameActive) return;

    setPlayer(prevPlayer => {
      let newPlayer = { ...prevPlayer };
      const keys = keysRef.current;

      // Horizontal movement
      if (keys.has('a') || keys.has('arrowleft')) {
        newPlayer.x = Math.max(0, newPlayer.x - MOVE_SPEED);
      }
      if (keys.has('d') || keys.has('arrowright')) {
        const gameArea = gameAreaRef.current;
        const maxX = gameArea ? gameArea.clientWidth - PLAYER_SIZE : 800;
        newPlayer.x = Math.min(maxX, newPlayer.x + MOVE_SPEED);
      }

      // Jumping
      if ((keys.has(' ') || keys.has('w') || keys.has('arrowup')) && newPlayer.isOnGround) {
        newPlayer.velocityY = JUMP_FORCE;
        newPlayer.isJumping = true;
        newPlayer.isOnGround = false;
      }

      // Apply gravity
      newPlayer.velocityY += GRAVITY;
      newPlayer.y += newPlayer.velocityY;

      // Check platform collisions
      newPlayer.isOnGround = false;
      for (const platform of platforms) {
        if (checkCollision(newPlayer.x, newPlayer.y + newPlayer.velocityY, platform)) {
          if (newPlayer.velocityY > 0) { // Falling
            newPlayer.y = platform.y - PLAYER_SIZE;
            newPlayer.velocityY = 0;
            newPlayer.isOnGround = true;
            newPlayer.isJumping = false;
          }
        }
      }

      // Check coin collection
      setCoins(prevCoins => {
        const newCoins = prevCoins.map(coin => {
          if (!coin.collected && 
              Math.abs(newPlayer.x - coin.x) < 30 && 
              Math.abs(newPlayer.y - coin.y) < 30) {
            setScore(prev => prev + 10);
            return { ...coin, collected: true };
          }
          return coin;
        });
        return newCoins;
      });

      return newPlayer;
    });
  }, [gameActive, checkCollision]);

  // Game loop
  useEffect(() => {
    if (gameActive) {
      gameLoopRef.current = setInterval(updateGame, 1000 / 60); // 60 FPS
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameActive, updateGame]);

  // Timer
  useEffect(() => {
    if (!gameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setPlayer({
      x: 50,
      y: 200,
      velocityY: 0,
      isJumping: false,
      isOnGround: false
    });
    setCoins(coins.map(coin => ({ ...coin, collected: false })));
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

      {/* Game instruction text */}
      <div className="text-center mb-4">
        <p className="text-[#00ff00] text-lg mb-2">
          Collect coins in this neon platformer! Use the controls below:
        </p>
        <div className="flex justify-center gap-4 text-[#00ff00]/80 text-sm">
          <span>A/← - Move Left</span>
          <span>D/→ - Move Right</span>
          <span>W/↑/Space - Jump</span>
        </div>
      </div>
      
      {/* Game area */}
      <div 
        ref={gameAreaRef}
        className="relative w-full h-[300px] border-2 border-[#00ff00]/50 rounded-lg backdrop-blur-sm bg-black/30 overflow-hidden mb-4"
      >
        {gameActive ? (
          <>
            {/* Platforms */}
            {platforms.map((platform, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${platform.x}px`,
                  top: `${platform.y}px`,
                  width: `${platform.width}px`,
                  height: `${platform.height}px`,
                  backgroundColor: '#00ff00',
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                }}
              />
            ))}

            {/* Coins */}
            {coins.map((coin, index) => (
              !coin.collected && (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `${coin.x}px`,
                    top: `${coin.y}px`,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#ffff00',
                    boxShadow: '0 0 15px rgba(255, 255, 0, 0.8)',
                    animation: 'pulse 1s infinite'
                  }}
                />
              )
            ))}

            {/* Player */}
            <div
              style={{
                position: 'absolute',
                left: `${player.x}px`,
                top: `${player.y}px`,
                width: `${PLAYER_SIZE}px`,
                height: `${PLAYER_SIZE}px`,
                backgroundColor: '#00ffff',
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
                transition: 'none'
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              onClick={startGame}
              className="bg-black/70 border border-[#00ff00] text-[#00ff00] hover:bg-black/90 hover:text-[#00ff00] hover:border-[#00ff00]/80 transition-all"
            >
              Click to Start Platformer
            </Button>
          </div>
        )}
      </div>
      
      {!gameActive && timeLeft === 0 && (
        <div className="text-center text-[#00ff00] mb-4">
          <p className="text-xl">Game Over! You collected {Math.floor(score / 10)} coins and scored {score} points!</p>
        </div>
      )}
    </div>
  );
};

export default NeonShooterGame;
