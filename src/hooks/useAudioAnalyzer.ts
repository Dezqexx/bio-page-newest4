
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
    // Skip setup if no audio element or already done
    if (!audioRef.current || isSetupDone.current) return;
    
    // Setup function will be called once audio can play
    const setupAnalyzer = () => {
      if (!audioRef.current || isSetupDone.current) return;
      
      try {
        // Wait until the audio element is properly loaded
        if (audioRef.current.readyState < 2) {
          return; // Not ready yet, wait for canplay event
        }
        
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        // Create analyzer node with smaller FFT size for better performance
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 64; // Smaller FFT size
        analyzerRef.current = analyzer;
        
        // Connect audio to analyzer
        const audioSource = audioContext.createMediaElementSource(audioRef.current);
        sourceRef.current = audioSource;
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);
        
        isSetupDone.current = true;
        console.log("Audio analyzer setup successfully");
        
        // Start analysis
        analyzeAudio();
      } catch (err) {
        console.error("Error setting up audio analyzer:", err);
      }
    };

    const analyzeAudio = () => {
      if (!analyzerRef.current) return;
      
      try {
        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);
        
        // Simplified bass detection (first few bins only)
        const bassValue = dataArray[1] || 0; // Just use the second bin for bass
        const normalizedBass = bassValue / 255; // Normalize to 0-1
        
        setBassLevel(normalizedBass);
        animationRef.current = requestAnimationFrame(analyzeAudio);
      } catch (e) {
        console.error("Error in audio analysis:", e);
      }
    };

    // Try setting up when the component mounts
    if (audioRef.current.readyState >= 2) {
      setupAnalyzer();
    }

    // Set up event listeners
    const handleCanPlay = () => setupAnalyzer();
    const handlePlay = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      if (!isSetupDone.current) {
        setupAnalyzer();
      } else if (!animationRef.current) {
        analyzeAudio();
      }
    };

    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.addEventListener('play', handlePlay);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('play', handlePlay);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Properly clean up audio nodes
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (analyzerRef.current) {
        analyzerRef.current.disconnect();
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [audioRef]);

  return { bassLevel };
};

export default useAudioAnalyzer;
