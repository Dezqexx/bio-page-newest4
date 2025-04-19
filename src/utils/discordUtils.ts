
import { DiscordActivity } from '@/types/discord';

export const getStatusColor = (status: string) => {
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

export const getImageUrl = (activity: DiscordActivity, listening_to_spotify?: boolean, spotify?: any) => {
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
  
  if (activity.application_id) {
    return `https://dcdn.dstn.to/app-icons/${activity.application_id}`;
  }
  
  return '';
};

export const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
