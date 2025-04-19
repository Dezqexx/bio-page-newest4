
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ArrowRight } from 'lucide-react';
import { DiscordUser as DiscordUserType } from '@/types/discord';
import { getStatusColor } from '@/utils/discordUtils';
import DiscordBadge from '@/components/DiscordBadge';

interface DiscordUserProps {
  user: DiscordUserType;
  status: string;
  customStatus?: {
    emoji?: {
      id: string;
      name: string;
      animated: boolean;
    };
    state?: string;
  };
}

const DiscordUser = ({ user, status, customStatus }: DiscordUserProps) => {
  const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=4096`;
  const displayName = user.global_name || user.username;

  const openDiscordProfile = () => {
    window.open(`https://discord.com/users/${user.id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-start pl-2 mb-3 relative">
      <div className="relative mr-3">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-12 h-12 rounded-full border border-[#00ff00]/30"
        />
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(status)} rounded-full border border-black`}></div>
      </div>
      <div className="text-left flex flex-col flex-grow">
        <div className="flex items-center">
          <div className="text-[#00ff00] font-medium">{displayName}</div>
          <div className="ml-1">
            <img src="https://I-love.thicc-thighs.com/aj2vumbr.svg" alt="Discord Nitro" className="w-5 h-5" />
          </div>
          <div className="ml-1">
            <img src="https://your-mom-is-so-fat-we-couldnt-fit-her-in-this-doma.in/p8l5ur18.svg" alt="Server Boosting" className="w-5 h-5" />
          </div>
        </div>
        
        {customStatus?.emoji && (
          <div className="text-[#00ff00]/70 text-xs flex items-center mt-1">
            <img 
              src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}`} 
              alt={customStatus.emoji.name} 
              className="w-5 h-5 mr-1"
            />
            {customStatus.state && <span>{customStatus.state}</span>}
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
  );
};

export default DiscordUser;
