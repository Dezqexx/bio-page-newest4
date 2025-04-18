
import React from 'react';
import { Icon } from '@iconify/react';
import { Music } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const SocialLinks = () => {
  return (
    <div className="flex gap-4 mt-6">
      {[
        { 
          icon: "mdi:steam", 
          href: "https://steamcommunity.com/id/Dezqex_", 
          label: "Steam", 
          type: "iconify" 
        },
        { 
          icon: "ic:baseline-discord", 
          href: "https://discord.com/users/790718755931815947/", 
          label: "Discord", 
          type: "iconify" 
        },
        { 
          icon: "mdi:spotify", 
          href: "https://open.spotify.com/user/31yejccpio46ekbtukq5qsx4o7sa", 
          label: "Spotify", 
          type: "iconify" 
        },
        { 
          icon: null, 
          href: "https://stats.fm/Dezqex", 
          label: "stats.fm", 
          type: "custom",
          customSrc: "https://your-mom-is-so-fat-we-couldnt-fit-her-in-this-doma.in/az6whjli.svg"
        },
        { 
          icon: "simple-icons:anilist", 
          href: "https://anilist.co/user/Dezqex", 
          label: "AniList", 
          type: "iconify" 
        },
      ].map(({ icon, href, label, type, customSrc }, index) => (
        <HoverCard key={index} openDelay={200} closeDelay={200}>
          <HoverCardTrigger asChild>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 hover:border-[#00ff00]/40 transition-all duration-300 group"
            >
              {type === "iconify" ? (
                <Icon icon={icon} className="w-5 h-5 text-[#00ff00]" />
              ) : type === "custom" ? (
                <img 
                  src={customSrc} 
                  alt={label} 
                  className="w-5 h-5 text-[#00ff00]"
                />
              ) : (
                <Music className="w-5 h-5 text-[#00ff00]" />
              )}
            </a>
          </HoverCardTrigger>
          <HoverCardContent 
            side="top" 
            align="center" 
            className="w-32 p-2 bg-black/70 backdrop-blur-md border-[#00ff00]/30 text-[#00ff00] text-xs"
          >
            {label}
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

export default SocialLinks;
