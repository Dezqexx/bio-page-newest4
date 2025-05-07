
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BackgroundVideo from "@/components/BackgroundVideo";
import AudioPlayer from "@/components/AudioPlayer";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import TiltCard from "@/components/TiltCard";
import MusicPlayer from "@/components/MusicPlayer";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useAudioContext } from "@/contexts/AudioContext";

// Card type for the memory game
type Card = {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
};

const Game = () => {
  useSparkleEffect();
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    handleSkipBack, 
    handleSkipForward, 
    progress,
    currentTime,
    duration,
    handleSeek,
    volume,
    handleMute,
    setVolume
  } = useAudioContext();

  // Memory game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Initialize the memory game
  useEffect(() => {
    const symbols = ['♠', '♥', '♦', '♣', '★', '✿', '✦', '✧'];
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameWon(false);
  }, []);

  const handleCardClick = (id: number) => {
    // Don't allow more than 2 cards flipped or clicking on already matched/flipped cards
    if (flippedCards.length === 2 || cards[id].matched || cards[id].flipped) return;

    // Flip the card
    const newCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // If we have 2 flipped cards, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlippedCards;
      if (newCards[first].value === newCards[second].value) {
        // Match found
        setTimeout(() => {
          const matchedCards = newCards.map(card => 
            card.id === first || card.id === second 
              ? { ...card, matched: true } 
              : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
          
          // Check if game is won
          if (matchedPairs + 1 === symbols.length) {
            setGameWon(true);
          }
        }, 500);
      } else {
        // No match, flip cards back
        setTimeout(() => {
          const resetCards = newCards.map(card => 
            card.id === first || card.id === second 
              ? { ...card, flipped: false } 
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    const symbols = ['♠', '♥', '♦', '♣', '★', '✿', '✦', '✧'];
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameWon(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      <AudioPlayer
        isMuted={volume === 0}
        volume={volume}
        onMute={handleMute}
        onVolumeChange={setVolume}
      />
      <Navigation />
      
      <div className="flex flex-col items-center max-w-3xl w-full px-4">
        <div className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full mb-4">
          <h1 className="text-4xl font-bold mb-6 text-[#00ff00] glow">Memory Game</h1>
          
          <div className="mb-4 flex justify-between items-center">
            <div className="text-[#00ff00]">Moves: {moves}</div>
            <div className="text-[#00ff00]">Matches: {matchedPairs}/{cards.length/2}</div>
          </div>
          
          {gameWon ? (
            <div className="text-center mb-4">
              <div className="text-2xl text-[#00ff00] mb-4">Congratulations! You won in {moves} moves!</div>
              <Button 
                className="border border-[#00ff00]/30 bg-black/40 text-[#00ff00] hover:bg-black/60 hover:border-[#00ff00]/50 backdrop-blur-sm"
                onClick={resetGame}
              >
                Play Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {cards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`cursor-pointer w-16 h-16 flex items-center justify-center rounded-lg transition-all duration-300 transform ${
                    card.flipped || card.matched 
                      ? 'bg-black/40 border-[#00ff00] border-2 text-[#00ff00]' 
                      : 'bg-black/80 border-[#00ff00]/30 border hover:border-[#00ff00]/50'
                  }`}
                >
                  {(card.flipped || card.matched) && (
                    <span className="text-2xl">{card.value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <Link to="/">
              <Button className="border border-[#00ff00]/30 bg-black/40 text-[#00ff00] hover:bg-black/60 hover:border-[#00ff00]/50 backdrop-blur-sm mr-2">
                Back to Home
              </Button>
            </Link>
            <Button 
              className="border border-[#00ff00]/30 bg-black/40 text-[#00ff00] hover:bg-black/60 hover:border-[#00ff00]/50 backdrop-blur-sm"
              onClick={resetGame}
            >
              Reset Game
            </Button>
          </div>
        </div>

        {currentTrack && (
          <div className="w-full flex justify-center">
            <MusicPlayer
              song={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              onSkipBack={handleSkipBack}
              onSkipForward={handleSkipForward}
              progress={progress}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
