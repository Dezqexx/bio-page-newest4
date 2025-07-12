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

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'fire' | 'saw';
}

interface FinishLine {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Level {
  platforms: Platform[];
  obstacles: Obstacle[];
  finishLine: FinishLine;
  playerStart: { x: number; y: number };
}

const NeonShooterGame = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameWon, setGameWon] = useState(false);
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

  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const MOVE_SPEED = 5;
  const PLAYER_SIZE = 20;

  // Define 10 levels with increasing difficulty
  const levels: Level[] = [
    // Level 1 - Simple introduction
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 }, // Ground
        { x: 200, y: 220, width: 100, height: 15 },
      ],
      obstacles: [
        { x: 350, y: 260, width: 20, height: 20, type: 'spike' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 50, y: 200 }
    },
    // Level 2 - More spikes
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 150, y: 220, width: 80, height: 15 },
        { x: 300, y: 180, width: 80, height: 15 },
        { x: 450, y: 220, width: 80, height: 15 },
      ],
      obstacles: [
        { x: 230, y: 260, width: 20, height: 20, type: 'spike' },
        { x: 380, y: 160, width: 20, height: 20, type: 'spike' },
        { x: 530, y: 200, width: 20, height: 20, type: 'spike' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 30, y: 200 }
    },
    // Level 3 - Fire obstacles
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 120, y: 220, width: 60, height: 15 },
        { x: 220, y: 160, width: 60, height: 15 },
        { x: 320, y: 200, width: 60, height: 15 },
        { x: 420, y: 140, width: 60, height: 15 },
        { x: 520, y: 180, width: 60, height: 15 },
      ],
      obstacles: [
        { x: 180, y: 200, width: 25, height: 25, type: 'fire' },
        { x: 280, y: 140, width: 25, height: 25, type: 'fire' },
        { x: 380, y: 180, width: 25, height: 25, type: 'fire' },
        { x: 480, y: 120, width: 25, height: 25, type: 'fire' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 30, y: 200 }
    },
    // Level 4 - Saw blades
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 100, y: 240, width: 80, height: 15 },
        { x: 250, y: 200, width: 80, height: 15 },
        { x: 400, y: 160, width: 80, height: 15 },
        { x: 550, y: 200, width: 80, height: 15 },
      ],
      obstacles: [
        { x: 180, y: 220, width: 30, height: 30, type: 'saw' },
        { x: 330, y: 140, width: 30, height: 30, type: 'saw' },
        { x: 480, y: 180, width: 30, height: 30, type: 'saw' },
        { x: 630, y: 180, width: 30, height: 30, type: 'saw' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 30, y: 200 }
    },
    // Level 5 - Mixed obstacles
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 80, y: 240, width: 60, height: 15 },
        { x: 180, y: 200, width: 60, height: 15 },
        { x: 280, y: 160, width: 60, height: 15 },
        { x: 380, y: 120, width: 60, height: 15 },
        { x: 480, y: 160, width: 60, height: 15 },
        { x: 580, y: 200, width: 60, height: 15 },
      ],
      obstacles: [
        { x: 140, y: 220, width: 20, height: 20, type: 'spike' },
        { x: 240, y: 140, width: 25, height: 25, type: 'fire' },
        { x: 340, y: 100, width: 30, height: 30, type: 'saw' },
        { x: 440, y: 140, width: 25, height: 25, type: 'fire' },
        { x: 540, y: 180, width: 20, height: 20, type: 'spike' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 20, y: 200 }
    },
    // Level 6 - Narrow passages
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 100, y: 220, width: 50, height: 15 },
        { x: 200, y: 180, width: 50, height: 15 },
        { x: 300, y: 140, width: 50, height: 15 },
        { x: 400, y: 100, width: 50, height: 15 },
        { x: 500, y: 140, width: 50, height: 15 },
        { x: 600, y: 180, width: 50, height: 15 },
      ],
      obstacles: [
        { x: 150, y: 200, width: 20, height: 20, type: 'spike' },
        { x: 250, y: 160, width: 20, height: 20, type: 'spike' },
        { x: 350, y: 120, width: 20, height: 20, type: 'spike' },
        { x: 450, y: 80, width: 20, height: 20, type: 'spike' },
        { x: 550, y: 120, width: 20, height: 20, type: 'spike' },
        { x: 650, y: 160, width: 20, height: 20, type: 'spike' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 30, y: 200 }
    },
    // Level 7 - Fire gauntlet
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 120, y: 200, width: 80, height: 15 },
        { x: 280, y: 160, width: 80, height: 15 },
        { x: 440, y: 200, width: 80, height: 15 },
        { x: 600, y: 160, width: 80, height: 15 },
      ],
      obstacles: [
        { x: 200, y: 180, width: 25, height: 25, type: 'fire' },
        { x: 220, y: 260, width: 25, height: 25, type: 'fire' },
        { x: 360, y: 140, width: 25, height: 25, type: 'fire' },
        { x: 380, y: 260, width: 25, height: 25, type: 'fire' },
        { x: 520, y: 180, width: 25, height: 25, type: 'fire' },
        { x: 540, y: 260, width: 25, height: 25, type: 'fire' },
        { x: 680, y: 140, width: 25, height: 25, type: 'fire' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 30, y: 200 }
    },
    // Level 8 - Saw maze
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 100, y: 240, width: 60, height: 15 },
        { x: 220, y: 200, width: 60, height: 15 },
        { x: 340, y: 160, width: 60, height: 15 },
        { x: 460, y: 120, width: 60, height: 15 },
        { x: 580, y: 160, width: 60, height: 15 },
      ],
      obstacles: [
        { x: 160, y: 220, width: 30, height: 30, type: 'saw' },
        { x: 180, y: 260, width: 30, height: 30, type: 'saw' },
        { x: 280, y: 140, width: 30, height: 30, type: 'saw' },
        { x: 300, y: 260, width: 30, height: 30, type: 'saw' },
        { x: 400, y: 100, width: 30, height: 30, type: 'saw' },
        { x: 420, y: 260, width: 30, height: 30, type: 'saw' },
        { x: 520, y: 140, width: 30, height: 30, type: 'saw' },
        { x: 540, y: 260, width: 30, height: 30, type: 'saw' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 30, y: 200 }
    },
    // Level 9 - Ultimate challenge
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 80, y: 240, width: 40, height: 15 },
        { x: 160, y: 200, width: 40, height: 15 },
        { x: 240, y: 160, width: 40, height: 15 },
        { x: 320, y: 120, width: 40, height: 15 },
        { x: 400, y: 80, width: 40, height: 15 },
        { x: 480, y: 120, width: 40, height: 15 },
        { x: 560, y: 160, width: 40, height: 15 },
        { x: 640, y: 200, width: 40, height: 15 },
      ],
      obstacles: [
        { x: 120, y: 220, width: 20, height: 20, type: 'spike' },
        { x: 200, y: 180, width: 20, height: 20, type: 'spike' },
        { x: 280, y: 140, width: 25, height: 25, type: 'fire' },
        { x: 360, y: 100, width: 25, height: 25, type: 'fire' },
        { x: 440, y: 60, width: 30, height: 30, type: 'saw' },
        { x: 520, y: 100, width: 25, height: 25, type: 'fire' },
        { x: 600, y: 140, width: 25, height: 25, type: 'fire' },
        { x: 680, y: 180, width: 20, height: 20, type: 'spike' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 20, y: 200 }
    },
    // Level 10 - Final boss level
    {
      platforms: [
        { x: 0, y: 280, width: 800, height: 20 },
        { x: 60, y: 260, width: 30, height: 15 },
        { x: 120, y: 240, width: 30, height: 15 },
        { x: 180, y: 220, width: 30, height: 15 },
        { x: 240, y: 200, width: 30, height: 15 },
        { x: 300, y: 180, width: 30, height: 15 },
        { x: 360, y: 160, width: 30, height: 15 },
        { x: 420, y: 140, width: 30, height: 15 },
        { x: 480, y: 120, width: 30, height: 15 },
        { x: 540, y: 140, width: 30, height: 15 },
        { x: 600, y: 160, width: 30, height: 15 },
        { x: 660, y: 180, width: 30, height: 15 },
      ],
      obstacles: [
        { x: 90, y: 240, width: 20, height: 20, type: 'spike' },
        { x: 150, y: 200, width: 25, height: 25, type: 'fire' },
        { x: 210, y: 180, width: 30, height: 30, type: 'saw' },
        { x: 270, y: 160, width: 25, height: 25, type: 'fire' },
        { x: 330, y: 140, width: 20, height: 20, type: 'spike' },
        { x: 390, y: 120, width: 25, height: 25, type: 'fire' },
        { x: 450, y: 100, width: 30, height: 30, type: 'saw' },
        { x: 510, y: 120, width: 25, height: 25, type: 'fire' },
        { x: 570, y: 140, width: 20, height: 20, type: 'spike' },
        { x: 630, y: 140, width: 25, height: 25, type: 'fire' },
        { x: 690, y: 160, width: 20, height: 20, type: 'spike' },
      ],
      finishLine: { x: 720, y: 220, width: 30, height: 60 },
      playerStart: { x: 20, y: 200 }
    }
  ];

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

  const checkCollision = useCallback((playerX: number, playerY: number, rect: { x: number; y: number; width: number; height: number }) => {
    const collision = (
      playerX < rect.x + rect.width &&
      playerX + PLAYER_SIZE > rect.x &&
      playerY < rect.y + rect.height &&
      playerY + PLAYER_SIZE > rect.y
    );
    
    // Debug logging for finish line collisions
    if (rect.width === 30 && rect.height === 60) { // This is likely the finish line
      console.log(`Finish line collision check:`, {
        playerX,
        playerY,
        playerRight: playerX + PLAYER_SIZE,
        playerBottom: playerY + PLAYER_SIZE,
        finishX: rect.x,
        finishY: rect.y,
        finishRight: rect.x + rect.width,
        finishBottom: rect.y + rect.height,
        collision
      });
    }
    
    return collision;
  }, []);

  const updateGame = useCallback(() => {
    if (!gameActive) return;

    const currentLevelData = levels[currentLevel];

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
      for (const platform of currentLevelData.platforms) {
        if (checkCollision(newPlayer.x, newPlayer.y + newPlayer.velocityY, platform)) {
          if (newPlayer.velocityY > 0) { // Falling
            newPlayer.y = platform.y - PLAYER_SIZE;
            newPlayer.velocityY = 0;
            newPlayer.isOnGround = true;
            newPlayer.isJumping = false;
          }
        }
      }

      // Check obstacle collisions (death)
      for (const obstacle of currentLevelData.obstacles) {
        if (checkCollision(newPlayer.x, newPlayer.y, obstacle)) {
          console.log(`Hit obstacle! Resetting to start.`);
          // Reset to start of current level
          newPlayer = {
            x: currentLevelData.playerStart.x,
            y: currentLevelData.playerStart.y,
            velocityY: 0,
            isJumping: false,
            isOnGround: false
          };
          break;
        }
      }

      // Check finish line collision - use the actual collision detection
      if (checkCollision(newPlayer.x, newPlayer.y, currentLevelData.finishLine)) {
        console.log(`Level ${currentLevel + 1} completed! Moving to next level.`);
        if (currentLevel < levels.length - 1) {
          // Move to next level
          setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
            setScore(prev => prev + 100);
          }, 100);
          
          const nextLevel = levels[currentLevel + 1];
          newPlayer = {
            x: nextLevel.playerStart.x,
            y: nextLevel.playerStart.y,
            velocityY: 0,
            isJumping: false,
            isOnGround: false
          };
        } else {
          // Game completed!
          setGameWon(true);
          setGameActive(false);
          setScore(prev => prev + 500);
        }
      }

      return newPlayer;
    });
  }, [gameActive, currentLevel, checkCollision]);

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

  const startGame = () => {
    setScore(0);
    setCurrentLevel(0);
    setGameActive(true);
    setGameWon(false);
    const firstLevel = levels[0];
    setPlayer({
      x: firstLevel.playerStart.x,
      y: firstLevel.playerStart.y,
      velocityY: 0,
      isJumping: false,
      isOnGround: false
    });
  };

  const renderObstacle = (obstacle: Obstacle, index: number) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${obstacle.x}px`,
      top: `${obstacle.y}px`,
      width: `${obstacle.width}px`,
      height: `${obstacle.height}px`,
    };

    switch (obstacle.type) {
      case 'spike':
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              backgroundColor: '#ff0000',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
            }}
          />
        );
      case 'fire':
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              backgroundColor: '#ff4500',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              boxShadow: '0 0 15px rgba(255, 69, 0, 0.8)',
              animation: 'pulse 0.5s infinite'
            }}
          />
        );
      case 'saw':
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              backgroundColor: '#888888',
              borderRadius: '50%',
              border: '3px solid #ff0000',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
              animation: 'spin 1s linear infinite'
            }}
          />
        );
      default:
        return null;
    }
  };

  const currentLevelData = levels[currentLevel];

  return (
    <div className="flex flex-col items-center w-full gap-6 px-4">
      <div className="flex w-full justify-between mb-4">
        <div className="text-[#00ff00] text-2xl font-bold">
          Score: {score}
        </div>
        
        <div className="text-[#00ff00] text-2xl font-bold">
          Level: {gameActive ? currentLevel + 1 : '-'} / 10
        </div>
      </div>

      {/* Game instruction text */}
      <div className="text-center mb-4">
        <p className="text-[#00ff00] text-lg mb-2">
          Navigate through 10 deadly levels! Reach the green finish line while avoiding obstacles.
        </p>
        <div className="flex justify-center gap-4 text-[#00ff00]/80 text-sm">
          <span>A/← - Move Left</span>
          <span>D/→ - Move Right</span>
          <span>W/↑/Space - Jump</span>
        </div>
        <p className="text-red-400 text-sm mt-2">
          Red spikes, orange fire, and spinning saws will reset you to the start!
        </p>
        <p className="text-cyan-400 text-sm mt-1">
          Player position: X: {Math.round(player.x)}, Y: {Math.round(player.y)}
        </p>
      </div>
      
      {/* Game area */}
      <div 
        ref={gameAreaRef}
        className="relative w-full h-[300px] border-2 border-[#00ff00]/50 rounded-lg backdrop-blur-sm bg-black/30 overflow-hidden mb-4"
      >
        {gameActive ? (
          <>
            {/* Platforms */}
            {currentLevelData.platforms.map((platform, index) => (
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

            {/* Obstacles */}
            {currentLevelData.obstacles.map((obstacle, index) => 
              renderObstacle(obstacle, index)
            )}

            {/* Finish Line - Made more visible and positioned correctly */}
            <div
              style={{
                position: 'absolute',
                left: `${currentLevelData.finishLine.x}px`,
                top: `${currentLevelData.finishLine.y}px`,
                width: `${currentLevelData.finishLine.width}px`,
                height: `${currentLevelData.finishLine.height}px`,
                backgroundColor: '#00ff00',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)',
                animation: 'pulse 1s infinite',
                background: 'linear-gradient(90deg, #00ff00 0%, #39FF14 50%, #00ff00 100%)',
                border: '2px solid #39FF14',
                borderRadius: '4px',
                zIndex: 10,
              }}
            >
              <div 
                className="absolute inset-0 flex items-center justify-center text-black font-bold text-xs"
                style={{ fontSize: '10px' }}
              >
                GOAL
              </div>
            </div>

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
                borderRadius: '2px',
                transition: 'none',
                zIndex: 20,
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              onClick={startGame}
              className="bg-black/70 border border-[#00ff00] text-[#00ff00] hover:bg-black/90 hover:text-[#00ff00] hover:border-[#00ff00]/80 transition-all"
            >
              {gameWon ? 'Play Again' : 'Start 10-Level Challenge'}
            </Button>
          </div>
        )}
      </div>
      
      {gameWon && (
        <div className="text-center text-[#00ff00] mb-4">
          <p className="text-2xl mb-2">🎉 CONGRATULATIONS! 🎉</p>
          <p className="text-xl">You completed all 10 levels and scored {score} points!</p>
        </div>
      )}
    </div>
  );
};

export default NeonShooterGame;
