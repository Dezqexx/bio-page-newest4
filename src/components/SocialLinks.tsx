
import { Steam, Discord, Music2, Activity, List } from 'lucide-react';

const SocialLinks = () => {
  return (
    <div className="flex gap-4 mt-6">
      {[
        { Icon: Steam, href: "#", label: "Steam" },
        { Icon: Discord, href: "#", label: "Discord" },
        { Icon: Music2, href: "#", label: "Spotify" },
        { Icon: Activity, href: "#", label: "stats.fm" },
        { Icon: List, href: "#", label: "AniList" },
      ].map(({ Icon, href, label }, index) => (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 hover:border-[#00ff00]/40 transition-all duration-300"
          title={label}
        >
          <Icon className="w-5 h-5 text-[#00ff00]" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
