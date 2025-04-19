
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
      <div className="mt-6 p-4 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm animate-pulse max-w-[320px] w-full">
        <div className="flex items-center justify-center">
          <div className="h-8 w-36 bg-[#00ff00]/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !lanyardData) {
    return (
      <div className="mt-6 p-4 border-2 border-[#00ff00]/20 rounded-lg bg-black/30 backdrop-blur-sm max-w-[320px] w-full">
        <div className="flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#00ff00]/50 mr-2" />
          <span className="text-[#00ff00]/50">Discord presence unavailable</span>
        </div>
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
    <TiltCard className="mt-6 text-center p-4 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm max-w-[320px] w-full">
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
    </TiltCard>
  );
};

export default DiscordPresence;
