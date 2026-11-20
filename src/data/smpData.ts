export const SERVER_CONFIG = {
  name: 'GlowSMP S2',
  season: 'Season 2',
  ip: 'play.glowsmp.bond',
  javaPort: '25565',
  bedrockPort: '19132',
  supportedVersions: '1.20.4 – 1.21.4 (Java & Bedrock)',
  owner: {
    minecraftUsername: 'Tiger_God__',
    discordUsername: 'Tiger2mSMP',
    role: 'Founder & Lead Administrator',
    discordUrl: 'https://discord.gg/tvf6XJfAcYt',
    youtubeUrl: 'https://youtube.com/@tiger_god947?si=fYjKM1oUZG_Srg8i',
    youtubeHandle: '@tiger_god947',
  },
  assets: {
    heroWorld: '/src/assets/images/hero_glowsmp_world_1795153239207.jpg',
    enchantsForge: '/src/assets/images/feature_enchants_forge_1795153239255.jpg',
    citadelKingdom: '/src/assets/images/feature_citadel_kingdom_1795153239808.jpg',
    ownerPortrait: '/src/assets/images/owner_tiger_god_1795153238762.jpg',
  },
} as const;

export interface SmpCommand {
  command: string;
  usage: string;
  category: 'Essential' | 'Claims' | 'Economy' | 'Combat';
  description: string;
}

export const SMP_COMMANDS: SmpCommand[] = [
  {
    command: '/rtp',
    usage: '/rtp',
    category: 'Essential',
    description: 'Teleport safely to an unclaimed wilderness biome to start your Season 2 base.',
  },
  {
    command: '/sethome',
    usage: '/sethome <name>',
    category: 'Essential',
    description: 'Save a warp coordinate at your base or farm so you can return anytime with /home.',
  },
  {
    command: '/tpa',
    usage: '/tpa <player>',
    category: 'Essential',
    description: 'Send a teleport request to another online player. They can run /tpaccept to bring you over.',
  },
  {
    command: '/spawn',
    usage: '/spawn',
    category: 'Essential',
    description: 'Return to the GlowSMP S2 central sanctuary bridge, trading post, and event portals.',
  },
  {
    command: '/claim',
    usage: '/claim',
    category: 'Claims',
    description: 'Use a golden shovel or run /claim to protect your chunks from griefing and theft.',
  },
  {
    command: '/trust',
    usage: '/trust <player>',
    category: 'Claims',
    description: 'Grant clan teammates permission to build and open chests inside your claimed land.',
  },
  {
    command: '/untrust',
    usage: '/untrust <player>',
    category: 'Claims',
    description: 'Revoke build and container permissions for a player inside your active land claim.',
  },
  {
    command: '/ah',
    usage: '/ah',
    category: 'Economy',
    description: 'Open the player-driven Auction House to bid on custom enchanted gear and rare blocks.',
  },
  {
    command: '/trade',
    usage: '/trade <player>',
    category: 'Economy',
    description: 'Initiate a scam-proof item and currency swap window with a nearby player.',
  },
  {
    command: '/bal',
    usage: '/bal',
    category: 'Economy',
    description: 'Check your current GlowCoins balance and inspect the Season 2 wealth leaderboard (/baltop).',
  },
  {
    command: '/shop',
    usage: '/shop',
    category: 'Economy',
    description: 'Access the balanced server market for building materials, redstone parts, and farm goods.',
  },
  {
    command: '/clan',
    usage: '/clan create <name>',
    category: 'Combat',
    description: 'Found a Season 2 clan, share private clan chat, and compete in weekend territory events.',
  },
  {
    command: '/duel',
    usage: '/duel <player>',
    category: 'Combat',
    description: 'Challenge another player to an arena duel without risking your survival inventory.',
  },
];

export interface SmpRule {
  id: string;
  title: string;
  category: 'Fair Play' | 'Community' | 'Claims & PvP' | 'Economy';
  summary: string;
  penalty: string;
}

export const SMP_RULES: SmpRule[] = [
  {
    id: '01',
    title: 'No Hacked Clients or Unfair Mods',
    category: 'Fair Play',
    summary:
      'X-ray texture packs, KillAura, Fly, Auto-Clicker, Baritone, and movement exploits are strictly forbidden. Performance mods like Sodium, OptiFine, and Litematica (without easy-place) are welcome.',
    penalty: '30-day ban to permanent ban',
  },
  {
    id: '02',
    title: 'Respect Claimed Land and Builds',
    category: 'Claims & PvP',
    summary:
      'Do not bypass land claims, lava-cast around claimed borders, or trap players in nether portals. Unclaimed wilderness raiding follows Season 2 event rules.',
    penalty: 'Rollback + 7-day ban',
  },
  {
    id: '03',
    title: 'Keep Chat Civil and Inclusive',
    category: 'Community',
    summary:
      'No slurs, harassment, doxxing, spam, or advertising external servers in global chat or Discord channels. Friendly rivalry is welcome; personal attacks are not.',
    penalty: 'Mute up to permanent ban',
  },
  {
    id: '04',
    title: 'No Duplication Glitches or Lag Machines',
    category: 'Economy',
    summary:
      'Exploiting item dupes, chunk-banning books, or high-entity lag farms undermines the entire Season 2 economy. Report bugs directly to Tiger_God__ on Discord for rewards.',
    penalty: 'Inventory wipe + permanent ban',
  },
  {
    id: '05',
    title: 'Honor Consensual Trades & Arena Rules',
    category: 'Economy',
    summary:
      'Always use /trade or /ah for item exchanges. Real-money trading (RMT) for in-game items or currency outside official server channels is prohibited.',
    penalty: 'Account suspension',
  },
  {
    id: '06',
    title: 'Fair PvP and No Combat Logging',
    category: 'Claims & PvP',
    summary:
      'Disconnecting while combat-tagged will drop your inventory automatically. Spawn-camping new players outside the sanctuary zone is disallowed.',
    penalty: 'Automatic death drop + warning',
  },
];

export interface WeeklyEvent {
  day: string;
  title: string;
  format: string;
  reward: string;
}

export const SEASON_EVENTS: WeeklyEvent[] = [
  {
    day: 'Fridays · 7:30 PM IST',
    title: 'Sanctuary Clan Skirmish',
    format: '4v4 Team PvP Arena',
    reward: 'Glow Crates & Clan Banner Trophy',
  },
  {
    day: 'Saturdays · 8:00 PM IST',
    title: 'Obsidian Warden Boss Raid',
    format: 'Server-Wide Co-op Boss',
    reward: 'Mythic Forged Artifact Drops',
  },
  {
    day: 'Sundays · 6:30 PM IST',
    title: 'Season 2 Build Showcase',
    format: 'Community Judging with Tiger_God__',
    reward: 'Featured on YouTube + Builder Title',
  },
];
