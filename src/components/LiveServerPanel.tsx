import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  RefreshCw,
  Search,
  Server,
  UserCheck,
  Users,
  WifiOff,
} from 'lucide-react';
import { SERVER_CONFIG } from '../data/smpData';
import type { OnlinePlayer, ServerEdition, ServerStatusResponse } from '../types/server';
import { VoxelAvatar } from './VoxelAvatar';

interface LiveServerPanelProps {
  edition: ServerEdition;
  onEditionChange: (edition: ServerEdition) => void;
  status: ServerStatusResponse | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onCopyText: (value: string, key: string) => void;
  copiedKey: string | null;
}

function formatCheckedTime(iso: string | undefined): string {
  if (!iso) return 'Just now';
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return 'Just now';
  }
}

export function LiveServerPanel({
  edition,
  onEditionChange,
  status,
  loading,
  refreshing,
  error,
  onRefresh,
  onCopyText,
  copiedKey,
}: LiveServerPanelProps) {
  const [playerQuery, setPlayerQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<OnlinePlayer | null>(null);
  const [lookupInput, setLookupInput] = useState<string>(SERVER_CONFIG.owner.minecraftUsername);

  const onlinePlayers = status?.players.list ?? [];

  const filteredPlayers = useMemo(() => {
    const q = playerQuery.trim().toLowerCase();
    if (!q) return onlinePlayers;
    return onlinePlayers.filter((p) => p.name.toLowerCase().includes(q));
  }, [onlinePlayers, playerQuery]);

  const activeInspectName = selectedPlayer?.name || lookupInput.trim() || SERVER_CONFIG.owner.minecraftUsername;
  const activeInspectOnline = onlinePlayers.some(
    (p) => p.name.toLowerCase() === activeInspectName.toLowerCase(),
  );
  const activeIsOwner =
    activeInspectName.toLowerCase() === SERVER_CONFIG.owner.minecraftUsername.toLowerCase();

  const isOnline = Boolean(status?.online);
  const isSleeping = Boolean(status?.sleeping);
  const onlineCount = status?.players.online ?? 0;
  const maxCount = status?.players.max ?? 0;
  const occupancyPct =
    isOnline && maxCount > 0 ? Math.min(100, Math.round((onlineCount / maxCount) * 100)) : 0;

  return (
    <section id="status" className="py-20 lg:py-24 border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Edition Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <p className="text-sm text-amber-400 font-medium">Live Server Monitor</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F3EE]">
              Real-time status for {SERVER_CONFIG.ip}
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-zinc-400">
              Polled directly from the Minecraft server every 30 seconds. Check active player counts,
              inspect who is online right now, and switch between Java and Bedrock endpoints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Functional Segmented Filter Control */}
            <div
              role="group"
              aria-label="Minecraft edition selector"
              className="inline-flex items-center rounded-lg bg-[#14171F] p-1 border border-white/[0.08]"
            >
              <button
                type="button"
                onClick={() => onEditionChange('java')}
                className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  edition === 'java'
                    ? 'bg-amber-500 text-[#090A0D] font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Java Edition
              </button>
              <button
                type="button"
                onClick={() => onEditionChange('bedrock')}
                className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  edition === 'bedrock'
                    ? 'bg-amber-500 text-[#090A0D] font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Bedrock Edition
              </button>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-[#14171F] px-4 py-2.5 text-xs font-medium text-[#F4F3EE] transition-colors hover:border-amber-400/50 hover:bg-[#1A1E28] disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`}
                aria-hidden="true"
              />
              <span>{refreshing ? 'Refreshing…' : 'Refresh Now'}</span>
            </button>
          </div>
        </div>

        {/* Main 12-col Live Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Columns: MOTD + Online Players Roster */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Server Readout Card */}
            <div className="rounded-xl border border-white/[0.08] bg-[#111318] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-4 min-w-0">
                  {status?.icon ? (
                    <img
                      src={status.icon}
                      alt="GlowSMP S2 server icon"
                      width={52}
                      height={52}
                      referrerPolicy="no-referrer"
                      style={{ imageRendering: 'pixelated' }}
                      className="h-13 w-13 rounded-lg border border-white/10 bg-[#090A0D] shrink-0"
                    />
                  ) : (
                    <div className="flex h-13 w-13 items-center justify-center rounded-lg border border-white/10 bg-[#181B22] text-amber-400 shrink-0">
                      <Server className="h-6 w-6" aria-hidden="true" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <h3 className="font-mono text-base sm:text-lg font-semibold text-[#F4F3EE] truncate">
                        {SERVER_CONFIG.ip}
                      </h3>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          loading || isSleeping
                            ? 'text-amber-300'
                            : isOnline
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            loading || isSleeping
                              ? 'bg-amber-400'
                              : isOnline
                                ? 'bg-emerald-400'
                                : 'bg-rose-400'
                          }`}
                          aria-hidden="true"
                        />
                        {loading
                          ? 'Checking live status'
                          : isSleeping
                            ? 'Sleeping · Join to Start'
                            : isOnline
                              ? 'Server Online'
                              : 'Server Offline'}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-400 tabular-nums">
                      <span>Port {status?.port ?? (edition === 'bedrock' ? 19132 : 25565)}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span>
                        {status?.latencyMs !== null && status?.latencyMs !== undefined
                          ? `Response ${status.latencyMs} ms`
                          : 'Response —'}
                      </span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span>Updated {formatCheckedTime(status?.checkedAt)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onCopyText(
                      edition === 'bedrock'
                        ? `${SERVER_CONFIG.ip}:${SERVER_CONFIG.bedrockPort}`
                        : SERVER_CONFIG.ip,
                      'panel-ip',
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-[#181B22] px-4 py-2 text-xs font-medium text-[#F4F3EE] transition-colors hover:border-amber-400/50 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedKey === 'panel-ip' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Copied Address</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                      <span>Copy {edition === 'bedrock' ? 'IP & Port' : 'Server IP'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Capacity Bar & MOTD */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-zinc-400">Active Capacity</span>
                    <span className="font-mono text-[#F4F3EE] tabular-nums">
                      {isOnline ? `${onlineCount} / ${maxCount || '—'} players` : '0 players online'}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOnline ? 'bg-amber-500' : 'bg-zinc-700'
                      }`}
                      style={{ width: `${isOnline ? Math.max(occupancyPct, onlineCount > 0 ? 4 : 0) : 0}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    {isSleeping
                      ? 'Auto-sleep active when idle · Connect in Minecraft to wake the server'
                      : isOnline
                        ? `${status?.version || 'Latest survival build'}${status?.software ? ` · ${status.software}` : ''}`
                        : error || 'Server is currently unreachable or restarting on this edition.'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 mb-2">Server Message of the Day (MOTD)</p>
                  <div className="rounded-lg bg-[#0A0B0F] border border-white/[0.06] px-3.5 py-2.5 font-mono text-xs leading-relaxed text-zinc-200 min-h-[56px] flex flex-col justify-center">
                    {loading ? (
                      <span className="text-zinc-500">Fetching MOTD from play.glowsmp.bond…</span>
                    ) : status?.motd.clean.length ? (
                      status.motd.clean.map((line, idx) => (
                        <span key={idx} className="truncate">
                          {line}
                        </span>
                      ))
                    ) : isOnline ? (
                      <span className="text-zinc-400">GlowSMP Season 2 — Survival Multiplayer</span>
                    ) : (
                      <span className="text-zinc-500">
                        Offline — check Discord for restart or maintenance announcements.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Who Is Online Right Now Roster */}
            <div className="rounded-xl border border-white/[0.08] bg-[#111318] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#F4F3EE]">
                    Who Is Online Right Now
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-400 tabular-nums">
                    {loading
                      ? 'Loading live player roster…'
                      : isOnline
                        ? `${onlineCount} ${onlineCount === 1 ? 'player' : 'players'} connected · Click any player to inspect`
                        : 'No active player session detected right now'}
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={playerQuery}
                    onChange={(e) => setPlayerQuery(e.target.value)}
                    placeholder="Filter online players…"
                    aria-label="Filter online players by username"
                    className="w-full rounded-lg border border-white/10 bg-[#0B0C10] py-2 pl-9 pr-3 text-xs text-[#F4F3EE] placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-[#151821] p-3 animate-pulse"
                      >
                        <div className="h-9 w-9 rounded-md bg-white/[0.07]" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3 w-24 rounded bg-white/[0.08]" />
                          <div className="h-2.5 w-14 rounded bg-white/[0.05]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isSleeping ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg bg-[#0B0C10] border border-amber-500/20 p-5">
                    <div className="flex items-start gap-3.5">
                      <Server className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-[#F4F3EE]">
                          {SERVER_CONFIG.ip} is currently asleep (0 / {maxCount || 20} players)
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                          GlowSMP S2 automatically sleeps when empty to save resources. Join{' '}
                          <span className="font-mono text-amber-300">{SERVER_CONFIG.ip}</span> in
                          Minecraft to wake the server automatically — live players will appear here
                          as soon as someone connects.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCopyText(SERVER_CONFIG.ip, 'sleep-copy-ip')}
                      className="rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-[#090A0D] hover:bg-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedKey === 'sleep-copy-ip' ? 'IP Copied' : 'Copy IP to Wake'}
                    </button>
                  </div>
                ) : !isOnline ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg bg-[#0B0C10] border border-white/[0.06] p-5">
                    <div className="flex items-start gap-3.5">
                      <WifiOff className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-[#F4F3EE]">
                          {SERVER_CONFIG.ip} ({edition === 'bedrock' ? 'Bedrock' : 'Java'}) appears offline
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                          The server may be restarting, updating plugins, or running on the other edition.
                          Try switching to {edition === 'java' ? 'Bedrock Edition' : 'Java Edition'} or
                          check announcements in the Discord server.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onEditionChange(edition === 'java' ? 'bedrock' : 'java')}
                      className="rounded-lg border border-white/12 bg-[#161922] px-3.5 py-2 text-xs font-medium text-[#F4F3EE] hover:border-amber-400/50 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Check {edition === 'java' ? 'Bedrock' : 'Java'}
                    </button>
                  </div>
                ) : filteredPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredPlayers.map((player) => {
                      const isOwner =
                        player.name.toLowerCase() ===
                        SERVER_CONFIG.owner.minecraftUsername.toLowerCase();
                      const isSelected =
                        selectedPlayer?.name.toLowerCase() === player.name.toLowerCase();
                      return (
                        <button
                          key={player.name}
                          type="button"
                          onClick={() => {
                            setSelectedPlayer(player);
                            setLookupInput(player.name);
                          }}
                          className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-amber-400/70 bg-amber-500/10'
                              : 'border-white/[0.07] bg-[#151821] hover:border-white/20 hover:bg-[#191D28]'
                          }`}
                        >
                          <VoxelAvatar username={player.name} size={36} isOwner={isOwner} />
                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-sm font-medium text-[#F4F3EE] truncate">
                              {player.name}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {isOwner ? 'Owner · Online' : 'In-game'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : onlinePlayers.length > 0 && playerQuery.trim() ? (
                  <div className="rounded-lg bg-[#0B0C10] border border-white/[0.06] p-5 text-center">
                    <p className="text-sm text-zinc-300">
                      No online players match &ldquo;{playerQuery}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => setPlayerQuery('')}
                      className="mt-2 text-xs font-medium text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  </div>
                ) : status?.players.hiddenList ? (
                  <div className="flex items-start gap-3.5 rounded-lg bg-[#0B0C10] border border-white/[0.06] p-5">
                    <Users className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-[#F4F3EE] tabular-nums">
                        {onlineCount} {onlineCount === 1 ? 'player is' : 'players are'} currently online
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        This server hides individual player names from external status queries
                        (common on Velocity/Bungee proxies or privacy-enabled servers). Join{' '}
                        <span className="font-mono text-zinc-200">{SERVER_CONFIG.ip}</span> and press{' '}
                        <span className="font-mono text-zinc-200">Tab</span> in-game to see the full
                        live list.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3.5 rounded-lg bg-[#0B0C10] border border-white/[0.06] p-5">
                    <Users className="h-5 w-5 text-zinc-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-[#F4F3EE]">
                        Server is online and ready — 0 players connected right now
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        Be the first to hop on <span className="font-mono text-zinc-200">{SERVER_CONFIG.ip}</span>{' '}
                        or ping your squad in Discord to start a session.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Player Skin & Command Quick Inspector */}
          <aside className="lg:col-span-4 rounded-xl border border-white/[0.08] bg-[#111318] p-6">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="font-display text-base font-semibold text-[#F4F3EE]">
                  Player Inspector
                </h3>
                <p className="text-xs text-zinc-400">Preview head &amp; copy in-game commands</p>
              </div>
              <UserCheck className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
            </div>

            <div className="mt-4">
              <label htmlFor="player-lookup-input" className="block text-xs text-zinc-400 mb-1.5">
                Minecraft Username
              </label>
              <div className="flex gap-2">
                <input
                  id="player-lookup-input"
                  type="text"
                  value={lookupInput}
                  onChange={(e) => {
                    setLookupInput(e.target.value);
                    setSelectedPlayer(null);
                  }}
                  placeholder="Enter IGN (e.g. Tiger_God__)"
                  className="w-full rounded-lg border border-white/10 bg-[#0B0C10] px-3 py-2 font-mono text-xs text-[#F4F3EE] placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLookupInput(SERVER_CONFIG.owner.minecraftUsername);
                    setSelectedPlayer(null);
                  }}
                  className="rounded-lg border border-white/10 bg-[#181B22] px-3 py-2 text-xs font-medium text-zinc-300 hover:border-amber-400/50 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Owner
                </button>
              </div>
            </div>

            {/* Selected Player Summary */}
            <div className="mt-5 flex items-center gap-4 rounded-lg bg-[#0B0C10] border border-white/[0.06] p-4">
              <VoxelAvatar
                username={activeInspectName}
                size={56}
                isOwner={activeIsOwner}
                className="border border-white/10"
              />
              <div className="min-w-0">
                <p className="font-mono text-base font-semibold text-[#F4F3EE] truncate">
                  {activeInspectName}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-zinc-400">
                  <span>{activeIsOwner ? 'Server Owner' : 'SMP Player'}</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className={activeInspectOnline ? 'text-emerald-400' : 'text-zinc-400'}>
                    {activeInspectOnline ? 'Online now' : 'Not in live list'}
                  </span>
                </div>
                {selectedPlayer?.uuid && (
                  <p className="mt-1 font-mono text-[11px] text-zinc-500 truncate">
                    {selectedPlayer.uuid}
                  </p>
                )}
              </div>
            </div>

            {/* Quick In-Game Command Copy List */}
            <div className="mt-5 space-y-2">
              <p className="text-xs text-zinc-400">One-click in-game actions</p>
              {[
                { label: 'Teleport Request', cmd: `/tpa ${activeInspectName}` },
                { label: 'Private Message', cmd: `/msg ${activeInspectName} Hey!` },
                { label: 'Start Trade', cmd: `/trade ${activeInspectName}` },
                { label: 'Trust on Claim', cmd: `/trust ${activeInspectName}` },
              ].map((item) => {
                const key = `inspect-${item.cmd}`;
                const copied = copiedKey === key;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onCopyText(item.cmd, key)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#151821] px-3.5 py-2.5 text-left transition-colors hover:border-amber-400/40 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#F4F3EE]">{item.label}</p>
                      <p className="font-mono text-[11px] text-zinc-400 truncate">{item.cmd}</p>
                    </div>
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
