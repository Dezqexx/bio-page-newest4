
import React from 'react';
import { Circle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type DiscordPresenceProps = {
  username: string;
  avatar?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  onClick?: () => void;
};

const DiscordPresence: React.FC<DiscordPresenceProps> = ({ 
  username, 
  avatar = "/your-avatar.jpg", 
  status = 'online',
  customStatus,
  onClick
}) => {
  // Status colors
  const statusColors = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500'
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-2 p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 hover:border-[#00ff00]/40 transition-all duration-300 cursor-pointer"
    >
      <div className="relative">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback className="bg-black/50">{username.charAt(0)}</AvatarFallback>
        </Avatar>
        <Circle 
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} border border-black rounded-full fill-current`} 
        />
      </div>
      <div className="flex flex-col items-start">
        <p className="text-[#00ff00] text-sm font-medium">{username}</p>
        {customStatus && (
          <p className="text-[#00ff00]/70 text-xs">{customStatus}</p>
        )}
      </div>
    </div>
  );
};

export default DiscordPresence;
