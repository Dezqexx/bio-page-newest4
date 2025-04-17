
import { useState, useEffect, useRef } from 'react';

interface AudioAnalyzerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const useAudioAnalyzer = ({ audioRef }: AudioAnalyzerProps) => {
  const [bassLevel, setBassLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const isSetupDone = useRef(false);

  useEffect(() => {
    if (!audioRef.current || isSetupDone.current) return;
    
    const setupAnalyzer = () => {
      if (!audioRef.current || isSetupDone.current) return;
      
      try {
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create analyzer node
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        analyzerRef.current = analyzer;

        // Connect audio to analyzer
        const audioSource = audioContext.createMediaElementSource(audioRef.current);
        sourceRef.current = audioSource;
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);
        
        isSetupDone.current = true;
        
        // Begin analysis after setup
        analyzeAudio();
        
        console.log("Audio analyzer setup successfully");
      } catch (err) {
        console.error("Error setting up audio analyzer:", err);
      }
    };

    // Function to analyze audio
    const analyzeAudio = () => {
      if (!analyzerRef.current) return;
      
      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
      analyzerRef.current.getByteFrequencyData(dataArray);
      
      // Focus on bass frequencies (roughly the first 5-10% of frequency bins)
      const bassFrequencies = dataArray.slice(0, Math.floor(dataArray.length * 0.1));
      const averageBass = 
        bassFrequencies.reduce((acc, val) => acc + val, 0) / bassFrequencies.length;
      
      // Normalize to 0-1 range and apply some easing
      const normalizedBass = Math.min(1, averageBass / 200);
      setBassLevel(normalizedBass);
      
      animationRef.current = requestAnimationFrame(analyzeAudio);
    };

    // Set up analyzer when audio is ready
    if (audioRef.current.readyState >= 2) {
      setupAnalyzer();
    } else {
      audioRef.current.addEventListener('canplay', setupAnalyzer, { once: true });
    }

    // Start analyzing when audio plays
    const handlePlay = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      if (!isSetupDone.current) {
        setupAnalyzer();
      } else {
        analyzeAudio();
      }
    };

    const handlePause = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', setupAnalyzer);
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (analyzerRef.current) {
        analyzerRef.current.disconnect();
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioRef]);

  return { bassLevel };
};

export default useAudioAnalyzer;
