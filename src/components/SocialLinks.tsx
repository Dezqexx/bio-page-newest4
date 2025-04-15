
import { Github, Twitter, Instagram, Youtube, Twitch } from 'lucide-react';

const SocialLinks = () => {
  return (
    <div className="flex gap-4 mt-6">
      {[
        { Icon: Github, href: "#" },
        { Icon: Twitter, href: "#" },
        { Icon: Instagram, href: "#" },
        { Icon: Youtube, href: "#" },
        { Icon: Twitch, href: "#" },
      ].map(({ Icon, href }, index) => (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 hover:border-[#00ff00]/40 transition-all duration-300"
        >
          <Icon className="w-5 h-5 text-[#00ff00]" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
