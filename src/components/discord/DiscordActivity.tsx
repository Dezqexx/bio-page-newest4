
import { Clock } from 'lucide-react';
import { DiscordActivity as DiscordActivityType, ACTIVITY_TYPES } from '@/types/discord';
import { getImageUrl, formatTime } from '@/utils/discordUtils';
import { Progress } from '@/components/ui/progress';

interface DiscordActivityProps {
  activity: DiscordActivityType;
  elapsedTime?: string;
  spotifyData?: {
    listening: boolean;
    progress: number;
    data: any;
  };
}

const DiscordActivity = ({ activity, elapsedTime, spotifyData }: DiscordActivityProps) => {
  const isSpotify = spotifyData?.listening && activity.type === 2;
  
  return (
    <div className="mt-2 border-t border-[#00ff00]/20 pt-2">
      <div className="flex items-center">
        <img
          src={getImageUrl(
            activity, 
            spotifyData?.listening, 
            spotifyData?.data
          )}
          alt={activity.name}
          className="h-12 w-12 rounded-md border border-[#00ff00]/30 mr-3"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        
        <div className="text-left flex-grow">
          <div className="text-[#00ff00]/90 text-sm">
            {ACTIVITY_TYPES[activity.type]} {activity.name}
          </div>
          
          {activity.details && (
            <div className="text-[#00ff00]/70 text-xs truncate max-w-[200px]">
              {activity.details}
            </div>
          )}
          
          {activity.type === 0 && elapsedTime && (
            <div className="text-[#00ff00]/60 text-xs mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {elapsedTime} elapsed
            </div>
          )}
          
          {isSpotify && (
            <div className="mt-2 w-full">
              <Progress 
                value={spotifyData.progress} 
                className="h-1 bg-[#00ff00]/20" 
                indicatorClassName="bg-[#00ff00]"
              />
              <div className="flex justify-between text-[#00ff00]/60 text-[10px] mt-1">
                <span>{formatTime(Date.now() - spotifyData.data.timestamps.start)}</span>
                <span>{formatTime(spotifyData.data.timestamps.end - spotifyData.data.timestamps.start)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscordActivity;
