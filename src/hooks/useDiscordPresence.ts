
import { useState, useEffect } from 'react';
import { LanyardData } from '@/types/discord';

export function useDiscordPresence(userId: string) {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const [spotifyProgress, setSpotifyProgress] = useState<number>(0);

  useEffect(() => {
    const fetchDiscordPresence = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Discord presence');
        }
        const data: LanyardData = await response.json();
        setLanyardData(data);
      } catch (err) {
        setError('Failed to load Discord presence');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscordPresence();

    const intervalId = setInterval(fetchDiscordPresence, 30000);
    
    return () => clearInterval(intervalId);
  }, [userId]);

  useEffect(() => {
    const updateTimes = () => {
      if (lanyardData?.data) {
        const { activities, spotify, listening_to_spotify } = lanyardData.data;
        
        const gameActivity = activities.find(act => act.type === 0);
        if (gameActivity?.timestamps?.start) {
          const startTime = gameActivity.timestamps.start;
          const elapsed = Date.now() - startTime;
          const hours = Math.floor(elapsed / 3600000);
          const minutes = Math.floor((elapsed % 3600000) / 60000);
          setElapsedTime(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
        }

        if (listening_to_spotify && spotify) {
          const { timestamps } = spotify;
          const total = timestamps.end - timestamps.start;
          const current = Date.now() - timestamps.start;
          const progress = Math.min((current / total) * 100, 100);
          setSpotifyProgress(progress);
        }
      }
    };

    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, [lanyardData]);

  return {
    lanyardData,
    isLoading,
    error,
    elapsedTime,
    spotifyProgress
  };
}
