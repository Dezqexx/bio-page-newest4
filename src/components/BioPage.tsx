
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Heart, Music, BookOpen, GamepadStick } from 'lucide-react';
import DiscordPresence from './DiscordPresence';

type BioPageProps = {
  onClose: () => void;
  username: string;
  avatar?: string;
};

const BioPage: React.FC<BioPageProps> = ({
  onClose,
  username = "Dez",
  avatar = "/your-avatar.jpg",
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-2xl bg-black/70 backdrop-blur-sm border border-[#00ff00]/20 text-[#00ff00] overflow-hidden">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-[#00ff00] hover:bg-[#00ff00]/10 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold text-[#00ff00] glow">{username}'s Bio</CardTitle>
          <CardDescription className="text-[#00ff00]/70">Get to know me better</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl flex items-center gap-2">
              <Heart className="w-5 h-5" /> About Me
            </h3>
            <p className="text-[#00ff00]/80">
              Hey there! I'm a music enthusiast and gamer from Germany. I spend most of my time exploring new sounds and sharing my discoveries with friends.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl flex items-center gap-2">
              <Music className="w-5 h-5" /> Music Taste
            </h3>
            <p className="text-[#00ff00]/80">
              I'm into all kinds of electronic music, from ambient to techno. Currently obsessed with Aphex Twin and Boards of Canada. Check out my stats.fm for what I'm currently listening to!
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl flex items-center gap-2">
              <GamepadStick className="w-5 h-5" /> Gaming
            </h3>
            <p className="text-[#00ff00]/80">
              I play a lot of indie games and some competitive titles. Currently playing: Elden Ring, CS2, and Stardew Valley.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Currently Reading
            </h3>
            <p className="text-[#00ff00]/80">
              "Thus Spoke Zarathustra" by Friedrich Nietzsche and "Snow Crash" by Neal Stephenson.
            </p>
          </div>
          
          <div className="pt-4 border-t border-[#00ff00]/20">
            <h3 className="text-lg mb-3">Discord Status</h3>
            <DiscordPresence 
              username="dezqex"
              status="online"
              customStatus="Playing CS2"
              avatar={avatar}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/20"
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BioPage;
