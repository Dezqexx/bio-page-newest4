
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Define more specific interface for each badge type
interface BadgeConfig {
  label: string;
  svg: JSX.Element;
  subscriberText?: string;
  boostText?: string;
}

interface DiscordBadgeProps {
  type: 'nitro' | 'verified' | 'staff' | 'partner' | 'hypesquad' | 'boost';
  className?: string;
}

const DiscordBadge = ({ type, className = "" }: DiscordBadgeProps) => {
  // Badge configurations
  const badges: Record<DiscordBadgeProps['type'], BadgeConfig> = {
    nitro: {
      label: "Discord Nitro",
      subscriberText: "Subscriber since 8/11/2022",
      svg: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${className}`}
        >
          <rect width="20" height="20" x="2" y="2" rx="4" fill="#5865F2" />
          <path
            d="M17.7 8.2c-1.3 2-3.2 3.8-5.7 3.8s-4.4-1.8-5.7-3.8l-1 4 2 4.5c1.2 1.2 3 2.3 4.7 2.3s3.5-1.1 4.7-2.3l2-4.5-1-4z"
            fill="white"
          />
        </svg>
      )
    },
    boost: {
      label: "Server Booster",
      boostText: "Server boosting since Aug 11, 2022",
      svg: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-5 h-5 ${className}`}
        >
          <path fill="#F47FFF" d="M19.83 8l-8-5.5a2 2 0 0 0-2.29.12l-7.11 6a2 2 0 0 0-.59 2.25l2.3 5.13a2 2 0 0 0 1.8 1.17L12 17v4l3.38-3.38a2 2 0 0 0 .59-1.42V8.92a.92.92 0 0 1 1.38-.76l2.31 1.34a.5.5 0 0 0 .63-.59L19.83 8z"/>
        </svg>
      )
    },
    verified: {
      label: "Verified",
      svg: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${className}`}
        >
          <path fill="#3BA55D" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    staff: {
      label: "Discord Staff",
      svg: (
        <svg
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${className}`}
        >
          <path fill="#5865F2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"/>
        </svg>
      )
    },
    partner: {
      label: "Discord Partner",
      svg: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${className}`}
        >
          <path fill="#5865F2" d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z"/>
        </svg>
      )
    },
    hypesquad: {
      label: "HypeSquad Events",
      svg: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${className}`}
        >
          <path fill="#FBB848" d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm3.97 12.41l-4.03-2.42L8 14.41l1.26-4.39 2.74-2.08 2.74 2.08 1.23 4.39z"/>
        </svg>
      )
    }
  };

  const badge = badges[type];

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="ml-1">
          {badge.svg}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        side="top" 
        align="center" 
        className="w-48 p-2 bg-black/70 backdrop-blur-md border-[#00ff00]/30 text-[#00ff00] text-xs"
      >
        {badge.label}
        {badge.subscriberText && <div className="text-[#00ff00]/70 mt-1">{badge.subscriberText}</div>}
        {badge.boostText && <div className="text-[#00ff00]/70 mt-1">{badge.boostText}</div>}
      </HoverCardContent>
    </HoverCard>
  );
};

export default DiscordBadge;
