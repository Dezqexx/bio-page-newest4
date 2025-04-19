
import { useEffect, useState } from 'react';
import TiltCard from '@/components/TiltCard';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import DiscordBadge from '@/components/DiscordBadge';

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
      id: string;
      name: string;
      type: number;
      state?: string;
      details?: string;
      application_id?: string;
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
        console.log("Lanyard Data:", data); // Log data for debugging
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

  const getImageUrl = (activity: any) => {
    if (!activity) return '';

    // For Spotify
    if (lanyardData?.data.listening_to_spotify && lanyardData?.data.spotify && activity.type === 2) {
      return lanyardData.data.spotify.album_art_url;
    }
    
    // For games with assets
    if (activity.assets?.large_image) {
      // If it's a Spotify image but we're not handling it as Spotify
      if (activity.assets.large_image.startsWith('spotify:')) {
        return '';
      }
      
      // For Discord's media proxy
      if (activity.assets.large_image.startsWith('mp:')) {
        return `https://media.discordapp.net/${activity.assets.large_image.replace('mp:', '')}`;
      }

      // For external assets
      if (activity.assets.large_image.startsWith('external/')) {
        return `https://media.discordapp.net/external/${activity.assets.large_image.replace('external/', '')}`;
      }
      
      // For raw URLs (including https)
      if (activity.assets.large_image.startsWith('http')) {
        return activity.assets.large_image;
      }
      
      // Default Discord CDN path for application assets
      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
    }

    // Use default image for specific games
    if (activity.name === "ELDEN RING") {
      return "https://cdn.discordapp.com/app-assets/946609449680908348/d20beeae614582ee841c00a52f8fbb7e.png";
    }
    
    return '';
  };

  const openDiscordProfile = () => {
    window.open(`https://discord.com/users/790718755931815947`, '_blank', 'noopener,noreferrer');
  };

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
  
  const avatarUrl = "https://cdn.discordapp.com/avatars/790718755931815947/a_86e001b599ecf28ab775d89b9a3e1dce.gif?size=4096";
  
  const displayName = discord_user.global_name || discord_user.username;

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
      <div className="flex items-start pl-2 mb-3 relative">
        <div className="relative mr-3">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full border border-[#00ff00]/30"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(discord_status)} rounded-full border border-black`}></div>
        </div>
        <div className="text-left flex flex-col flex-grow">
          <div className="flex items-center">
            <div className="text-[#00ff00] font-medium">{displayName}</div>
            <DiscordBadge type="nitro" />
            <DiscordBadge type="boost" />
          </div>
          
          {customStatusActivity?.emoji && (
            <div className="text-[#00ff00]/70 text-xs flex items-center mt-1">
              <img 
                src={`https://cdn.discordapp.com/emojis/${customStatusActivity.emoji.id}.${customStatusActivity.emoji.animated ? 'gif' : 'png'}`} 
                alt={customStatusActivity.emoji.name} 
                className="w-5 h-5 mr-1"
              />
              {customStatusActivity.state && <span>{customStatusActivity.state}</span>}
            </div>
          )}
        </div>
        
        <HoverCard openDelay={200} closeDelay={200}>
          <HoverCardTrigger asChild>
            <button 
              onClick={openDiscordProfile}
              className="absolute top-0 right-0 text-[#00ff00] hover:text-[#39FF14] transition-colors duration-300 group"
            >
              <ArrowRight 
                className="w-6 h-6 group-hover:scale-110 transition-transform" 
                strokeWidth={3}
              />
            </button>
          </HoverCardTrigger>
          <HoverCardContent 
            side="left" 
            align="start" 
            className="w-32 p-2 bg-black/70 backdrop-blur-md border-[#00ff00]/30 text-[#00ff00] text-xs"
          >
            Open Discord Profile
          </HoverCardContent>
        </HoverCard>
      </div>
      
      {currentActivity && currentActivity.type !== 4 && (
        <div className="mt-2 border-t border-[#00ff00]/20 pt-2">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-md border border-[#00ff00]/30 mr-3 overflow-hidden">
              <img
                src={getImageUrl(currentActivity)}
                alt={currentActivity.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error("Failed to load image:", e);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            
            <div className="text-left">
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
        </div>
      )}
    </TiltCard>
  );
};

export default DiscordPresence;
