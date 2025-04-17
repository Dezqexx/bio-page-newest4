
import { useEffect, useState } from 'react';
import TiltCard from '@/components/TiltCard';
import { Activity, MessageCircle, Gamepad, Music, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface LanyardData {
  data: {
    discord_user: {
      id: string;
      username: string;
      avatar: string;
      discriminator: string;
      global_name: string | null;
    };
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: Array<{
      name: string;
      type: number;
      state?: string;
      details?: string;
      emoji?: {
        id: string;
        name: string;
        animated: boolean;
      };
      assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
      };
      timestamps?: {
        start?: number;
        end?: number;
      };
    }>;
    listening_to_spotify: boolean;
    spotify?: {
      track_id: string;
      timestamps: {
        start: number;
        end: number;
      };
      song: string;
      artist: string;
      album_art_url: string;
      album: string;
    };
  };
}

// Activity types from Discord API
// 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 4 = Custom, 5 = Competing
const activityTypes = ["Playing", "Streaming", "Listening to", "Watching", "Custom", "Competing in"];

const DiscordPresence = () => {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscordPresence = async () => {
      try {
        const response = await fetch('https://api.lanyard.rest/v1/users/790718755931815947');
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

    // Optionally setup websocket for real-time updates
    // For now we'll just use polling every 30 seconds
    const intervalId = setInterval(fetchDiscordPresence, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'dnd':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 p-4 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm animate-pulse">
        <div className="flex items-center justify-center">
          <div className="h-8 w-36 bg-[#00ff00]/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !lanyardData) {
    return (
      <div className="mt-6 p-4 border-2 border-[#00ff00]/20 rounded-lg bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#00ff00]/50 mr-2" />
          <span className="text-[#00ff00]/50">Discord presence unavailable</span>
        </div>
      </div>
    );
  }

  const { discord_user, discord_status, activities, spotify, listening_to_spotify } = lanyardData.data;
  
  // Use the provided avatar URL directly
  const avatarUrl = "https://cdn.discordapp.com/avatars/790718755931815947/a_86e001b599ecf28ab775d89b9a3e1dce.gif?size=4096";
  
  const displayName = discord_user.global_name || discord_user.username;

  // Filter activities to identify custom status and other activities
  const customStatusActivity = activities.find(act => act.type === 4);
  const otherActivities = activities.filter(act => act.type !== 4);
  
  // Get the current activity - prioritize non-custom activities or Spotify
  let currentActivity = null;
  if (listening_to_spotify && spotify) {
    currentActivity = {
      type: 2, // Spotify is type 2 (Listening)
      name: spotify.song,
      details: `by ${spotify.artist}`,
      assets: { large_image: spotify.album_art_url }
    };
  } else if (otherActivities.length > 0) {
    currentActivity = otherActivities[0];
  }

  return (
    <TiltCard className="mt-6 text-center p-4 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm">
      <div className="flex items-center justify-center mb-3">
        <div className="relative mr-3">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full border border-[#00ff00]/30"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(discord_status)} rounded-full border border-black`}></div>
        </div>
        <div className="text-left flex flex-col">
          <div className="flex items-center">
            <div className="text-[#00ff00] font-medium">{displayName}</div>
            {/* Discord Nitro icon */}
            <HoverCard>
              <HoverCardTrigger>
                <svg
                  className="ml-1 w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
                    fill="#5865F2"
                  />
                  <path
                    d="M17 7.5c-1 1.5-2.5 3-5 3s-4-1.5-5-3l-1 3.5 2 4.5s2.5 2 4 2 4-2 4-2l2-4.5-1-3.5z"
                    fill="white"
                  />
                </svg>
              </HoverCardTrigger>
              <HoverCardContent className="w-32 p-2 bg-black/70 backdrop-blur-md border-[#00ff00]/30 text-[#00ff00]/80 text-xs">
                Discord Nitro
              </HoverCardContent>
            </HoverCard>
          </div>
          
          {/* Custom Status with Emoji below username */}
          {customStatusActivity?.emoji && (
            <div className="text-[#00ff00]/70 text-xs flex items-center mt-1">
              <img 
                src={`https://cdn.discordapp.com/emojis/${customStatusActivity.emoji.id}.${customStatusActivity.emoji.animated ? 'gif' : 'png'}`} 
                alt={customStatusActivity.emoji.name} 
                className="w-4 h-4 mr-1"
              />
              {customStatusActivity.state && <span>{customStatusActivity.state}</span>}
            </div>
          )}
        </div>
      </div>
      
      {/* Only show activity section if there's a current activity (not custom status) */}
      {currentActivity && currentActivity.type !== 4 && (
        <div className="mt-2 border-t border-[#00ff00]/20 pt-2">
          <div className="flex items-center justify-center">
            {currentActivity.type === 2 ? (
              <Music className="w-5 h-5 text-[#00ff00]" />
            ) : (
              <Gamepad className="w-5 h-5 text-[#00ff00]" />
            )}
            
            <div className="ml-2 text-left">
              <div className="text-[#00ff00]/90 text-sm">
                {activityTypes[currentActivity.type]} {currentActivity.name}
              </div>
              
              {currentActivity.details && (
                <div className="text-[#00ff00]/70 text-xs truncate max-w-[200px]">
                  {currentActivity.details}
                </div>
              )}
            </div>
          </div>
          
          {currentActivity.assets?.large_image && (
            <div className="mt-2 flex justify-center">
              <img
                src={
                  currentActivity.assets.large_image.startsWith('spotify:')
                    ? listening_to_spotify && spotify 
                      ? spotify.album_art_url 
                      : ''
                    : currentActivity.assets.large_image.startsWith('mp:') 
                      ? `https://media.discordapp.net/external/${currentActivity.assets.large_image.replace('mp:', '')}`
                      : `https://cdn.discordapp.com/app-assets/${currentActivity.type === 0 ? discord_user.id : 'spotify'}/${currentActivity.assets.large_image}.png`
                }
                alt={currentActivity.assets.large_text || currentActivity.name}
                className="h-16 rounded-md border border-[#00ff00]/30"
                onError={(e) => {
                  // Hide the image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}
    </TiltCard>
  );
};

export default DiscordPresence;
