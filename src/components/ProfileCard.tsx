
import React from 'react';
import { MapPin, Quote } from 'lucide-react';
import SocialLinks from './SocialLinks';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProfileCardProps = {
  username: string;
  avatar?: string;
  location?: string;
  quote?: string;
  onBioClick: () => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  username = "Dez",
  avatar = "/your-avatar.jpg",
  location = "Germany",
  quote = "\"Without music, life would be a mistake\" — Friedrich Nietzsche",
  onBioClick
}) => {
  return (
    <Card className="w-full max-w-md bg-black/30 backdrop-blur-sm border border-[#00ff00]/20 text-[#00ff00] overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="absolute top-2 right-2 text-[#00ff00] text-xs flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-[#00ff00] rounded-full animate-pulse"></span>
          329
        </div>
        
        <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-[#00ff00] overflow-hidden glow mt-6">
          <Avatar className="w-full h-full">
            <AvatarImage src={avatar} alt={username} className="w-full h-full object-cover" />
            <AvatarFallback className="w-full h-full bg-black/50 text-[#00ff00] text-4xl">
              {username.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-[#00ff00] glow flex items-center gap-2">
          {username}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-[#00ff00]/10 border border-[#00ff00]/20 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512" fill="#00ff00">
              <path d="M320 0H64C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h64v64c0 9.3 5.6 17.7 14.2 21.1s18.6 1.6 24.8-5.9l72.8-79.2H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zM448 160c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H385.8l53 57.6c6.3 6.8 7.9 16.9 4 25.4s-12.4 14-21.8 14H304c-8.8 0-16-7.2-16-16V416H160c0 35.3 28.7 64 64 64H338.7L411.5 557.6c6.3 6.8 7.9 16.9 4 25.4s-12.4 14-21.8 14H288c-35.3 0-64-28.7-64-64V416H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64V352c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160z"/>
            </svg>
          </Button>
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-[#00ff00]/80 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        
        {quote && (
          <div className="mb-6 text-center text-[#00ff00]/70 italic flex items-start px-4">
            <Quote className="w-4 h-4 mr-1 flex-shrink-0 mt-1" />
            <p>{quote}</p>
          </div>
        )}
        
        <Button 
          onClick={onBioClick}
          className="mb-4 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/20"
        >
          View Bio
        </Button>
        
        <SocialLinks />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
