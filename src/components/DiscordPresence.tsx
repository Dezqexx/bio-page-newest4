
import { useEffect, useState } from 'react';
import TiltCard from '@/components/TiltCard';
import { Activity, MessageCircle, Gamepad, Music } from 'lucide-react';

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'idle':
        return 'Idle';
      case 'dnd':
        return 'Do Not Disturb';
      default:
        return 'Offline';
    }
  };

  const getActivityIcon = (type: number) => {
    switch (type) {
      case 0:
        return <Gamepad className="w-5 h-5 text-[#00ff00]" />;
      case 2:
        return <Music className="w-5 h-5 text-[#00ff00]" />;
      default:
        return <Activity className="w-5 h-5 text-[#00ff00]" />;
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
  const statusColor = getStatusColor(discord_status);
  const statusText = getStatusText(discord_status);
  
  const avatarUrl = discord_user.avatar 
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discord_user.discriminator) % 5}.png`;
  
  const displayName = discord_user.global_name || discord_user.username;

  // Current activity (prioritize Spotify, then other activities)
  let currentActivity = null;
  if (listening_to_spotify && spotify) {
    currentActivity = {
      type: 2, // Spotify is type 2 (Listening)
      name: spotify.song,
      details: `by ${spotify.artist}`,
      assets: { large_image: spotify.album_art_url }
    };
  } else if (activities && activities.length > 0) {
    // Filter out custom status (type 4) if there are other activities
    const nonCustomActivities = activities.filter(act => act.type !== 4);
    currentActivity = nonCustomActivities.length > 0 ? nonCustomActivities[0] : activities[0];
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
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full border border-black`}></div>
        </div>
        <div className="text-left">
          <div className="text-[#00ff00] font-medium">{displayName}</div>
          <div className="flex items-center text-xs text-[#00ff00]/70">
            <div className={`w-2 h-2 ${statusColor} rounded-full mr-1`}></div>
            {statusText}
          </div>
        </div>
      </div>

      {currentActivity && (
        <div className="mt-2 border-t border-[#00ff00]/20 pt-2">
          <div className="flex items-center justify-center">
            {getActivityIcon(currentActivity.type)}
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
