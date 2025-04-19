
export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  global_name: string | null;
}

export interface DiscordActivity {
  name: string;
  type: number;
  state?: string;
  details?: string;
  application_id?: string;
  emoji?: {
    id: string;
    name: string;
    animated: boolean;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  timestamps?: {
    start?: number;
    end?: number;
  };
}

export interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

export interface LanyardData {
  data: {
    discord_user: DiscordUser;
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: Array<DiscordActivity>;
    listening_to_spotify: boolean;
    spotify?: SpotifyData;
  };
}

export const ACTIVITY_TYPES = ["Playing", "Streaming", "Listening to", "Watching", "Custom", "Competing in"];
