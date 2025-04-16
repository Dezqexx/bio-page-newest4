
import { Icon } from '@iconify/react';

const SocialLinks = () => {
  return (
    <div className="flex gap-4 mt-6">
      {[
        { icon: "mdi:steam", href: "#", label: "Steam" },
        { icon: "ic:baseline-discord", href: "#", label: "Discord" },
        { icon: "mdi:spotify", href: "#", label: "Spotify" },
        { icon: "simple-icons:statsfm", href: "https://stats.fm/", label: "stats.fm" },
        { icon: "simple-icons:anilist", href: "#", label: "AniList" },
      ].map(({ icon, href, label }, index) => (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 hover:border-[#00ff00]/40 transition-all duration-300"
          title={label}
        >
          <Icon icon={icon} className="w-5 h-5 text-[#00ff00]" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
