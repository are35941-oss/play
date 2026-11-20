export interface OnlinePlayer {
  name: string;
  uuid?: string;
}

export type ServerEdition = 'java' | 'bedrock';

export interface ServerStatusResponse {
  online: boolean;
  sleeping: boolean;
  host: string;
  ip: string | null;
  port: number;
  edition: ServerEdition;
  players: {
    online: number;
    max: number;
    list: OnlinePlayer[];
    hiddenList: boolean;
  };
  version: string | null;
  software: string | null;
  motd: {
    clean: string[];
    raw: string[];
  };
  icon: string | null;
  latencyMs: number | null;
  ownerOnline: boolean;
  checkedAt: string;
  source: string;
  error?: string;
}
