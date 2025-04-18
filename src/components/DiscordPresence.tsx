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
    if (listening_to_spotify && spotify && activity.type === 2) {
      return spotify.album_art_url;
    }
    
    if (activity.assets?.large_image) {
      if (activity.assets.large_image.startsWith('spotify:')) {
        return '';
      }
      
      if (activity.assets.large_image.startsWith('mp:')) {
        return `https://media.discordapp.net/external/${activity.assets.large_image.replace('mp:', '')}`;
      }
      
      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
    }
    
    return '';
  };

  const openDiscordProfile = () => {
    window.open(`https://discord.com/users/790718755931815947`, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="mt-6 p-4 border-2 border-[#9b87f5]/50 rounded-lg bg-black/30 backdrop-blur-sm animate-pulse max-w-[320px] w-full">
        <div className="flex items-center justify-center">
          <div className="h-8 w-36 bg-[#9b87f5]/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !lanyardData) {
    return (
      <div className="mt-6 p-4 border-2 border-[#9b87f5]/20 rounded-lg bg-black/30 backdrop-blur-sm max-w-[320px] w-full">
        <div className="flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#9b87f5]/50 mr-2" />
          <span className="text-[#9b87f5]/50">Discord presence unavailable</span>
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
    <TiltCard className="mt-6 text-center p-4 border-2 border-[#9b87f5]/50 rounded-lg bg-black/30 backdrop-blur-sm max-w-[320px] w-full">
      <div className="flex items-start pl-2 mb-3 relative">
        <div className="relative mr-3">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full border border-[#9b87f5]/30"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(discord_status)} rounded-full border border-black`}></div>
        </div>
        <div className="text-left flex flex-col flex-grow">
          <div className="flex items-center">
            <div className="text-[#9b87f5] font-medium">{displayName}</div>
            <div className="ml-1">
              <img src="https://I-love.thicc-thighs.com/aj2vumbr.svg" alt="Discord Nitro" className="w-5 h-5" />
            </div>
            <div className="ml-1">
              <img src="https://your-mom-is-so-fat-we-couldnt-fit-her-in-this-doma.in/p8l5ur18.svg" alt="Server Boosting" className="w-5 h-5" />
            </div>
          </div>
          
          {customStatusActivity?.emoji && (
            <div className="text-[#9b87f5]/70 text-xs flex items-center mt-1">
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
              className="absolute top-0 right-0 text-[#9b87f5] hover:text-[#8B5CF6] transition-colors duration-300 group"
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
            className="w-32 p-2 bg-black/70 backdrop-blur-md border-[#9b87f5]/30 text-[#9b87f5] text-xs"
          >
            Open Discord Profile
          </HoverCardContent>
        </HoverCard>
      </div>
      
      {currentActivity && currentActivity.type !== 4 && (
        <div className="mt-2 border-t border-[#9b87f5]/20 pt-2">
          <div className="flex items-center">
            <img
              src={getImageUrl(currentActivity)}
              alt={currentActivity.name}
              className="h-12 w-12 rounded-md border border-[#9b87f5]/30 mr-3"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            
            <div className="text-left">
              <div className="text-[#9b87f5]/90 text-sm">
                {activityTypes[currentActivity.type]} {currentActivity.name}
              </div>
              
              {currentActivity.details && (
                <div className="text-[#9b87f5]/70 text-xs truncate max-w-[200px]">
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
