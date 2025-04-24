
import { MessageCircle } from 'lucide-react';
import TiltCard from '@/components/TiltCard';
import { useDiscordPresence } from '@/hooks/useDiscordPresence';
import DiscordUser from '@/components/discord/DiscordUser';
import DiscordActivity from '@/components/discord/DiscordActivity';

const DISCORD_USER_ID = '790718755931815947';

const DiscordPresence = () => {
  const { lanyardData, isLoading, error, elapsedTime, spotifyProgress } = useDiscordPresence(DISCORD_USER_ID);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-36 bg-[#00ff00]/10 rounded"></div>
      </div>
    );
  }

  if (error || !lanyardData) {
    return (
      <div className="flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-[#00ff00]/50 mr-2" />
        <span className="text-[#00ff00]/50">Discord presence unavailable</span>
      </div>
    );
  }

  const { discord_user, discord_status, activities, spotify, listening_to_spotify } = lanyardData.data;
  
  const customStatusActivity = activities.find(act => act.type === 4);
  const otherActivities = activities.filter(act => act.type !== 4);
  
  let currentActivity = null;
  if (listening_to_spotify && spotify) {
    currentActivity = {
      type: 2,
      name: spotify.song,
      details: `by ${spotify.artist}`,
      assets: { large_image: spotify.album_art_url }
    };
  } else if (otherActivities.length > 0) {
    currentActivity = otherActivities[0];
  }

  return (
    <div>
      <DiscordUser 
        user={discord_user} 
        status={discord_status} 
        customStatus={customStatusActivity}
      />
      
      {currentActivity && currentActivity.type !== 4 && (
        <DiscordActivity 
          activity={currentActivity} 
          elapsedTime={currentActivity.type === 0 ? elapsedTime : undefined}
          spotifyData={
            listening_to_spotify && spotify && currentActivity.type === 2 
              ? { listening: true, progress: spotifyProgress, data: spotify } 
              : undefined
          }
        />
      )}
    </div>
  );
};

export default DiscordPresence;
