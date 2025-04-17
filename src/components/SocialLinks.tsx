
import { Icon } from '@iconify/react';
import { Music } from 'lucide-react';

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
          type: "lucide" 
        },
        { 
          icon: "simple-icons:anilist", 
          href: "https://anilist.co/user/Dezqex", 
          label: "AniList", 
          type: "iconify" 
        },
      ].map(({ icon, href, label, type }, index) => (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 hover:border-[#00ff00]/40 transition-all duration-300"
          title={label}
        >
          {type === "iconify" ? (
            <Icon icon={icon} className="w-5 h-5 text-[#00ff00]" />
          ) : (
            <Music className="w-5 h-5 text-[#00ff00]" />
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
