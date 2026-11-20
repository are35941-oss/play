import { ArrowUpRight, Check, Copy, RefreshCw } from 'lucide-react';
import { SERVER_CONFIG } from '../data/smpData';
import type { ServerStatusResponse } from '../types/server';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  status: ServerStatusResponse | null;
  loading: boolean;
  refreshing: boolean;
  copiedIp: boolean;
  onCopyIp: () => void;
  onRefresh: () => void;
}

export function HeroSection({
  status,
  loading,
  refreshing,
  copiedIp,
  onCopyIp,
  onRefresh,
}: HeroSectionProps) {
  const isOnline = Boolean(status?.online);
  const isSleeping = Boolean(status?.sleeping);
  const onlineCount = status?.players.online ?? 0;
  const maxCount = status?.players.max ?? 0;

  return (
    <section id="top" className="relative border-b border-white/[0.08]">
      {/* Main Hero Visual Carrier */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ResilientImage
            src={SERVER_CONFIG.assets.heroWorld}
            alt="GlowSMP Season 2 twilight sanctuary fortress bridge illuminated by amber lanterns"
            fallbackLabel="GlowSMP Season 2 Sanctuary"
            className="h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#090A0D] via-[#090A0D]/85 to-[#090A0D]/40"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-transparent to-[#090A0D]/55"
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-20 lg:pt-28 lg:pb-24">
          <div className="max-w-2xl">
            {/* Unboxed metadata kicker with typographic separators */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-zinc-300 mb-5">
              <span className="font-medium text-amber-400">Season 2</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Java &amp; Bedrock Cross-Play</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Founded by {SERVER_CONFIG.owner.minecraftUsername}</span>
            </div>

            <h1 className="font-display text-[clamp(2.35rem,4.5vw,4rem)] font-bold leading-[1.06] tracking-tight text-[#F4F3EE]">
              Survive, build, and carve your legacy in GlowSMP S2.
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-300">
              A Vanilla+ survival multiplayer realm built for builders, redstoners, and clan
              strategists. Claim land without griefing, forge custom glow enchants, and track live
              players on <span className="font-mono text-amber-300">{SERVER_CONFIG.ip}</span>.
            </p>

            {/* Focused primary CTA + secondary link */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={onCopyIp}
                className="inline-flex items-center justify-between sm:justify-center gap-3 rounded-lg bg-amber-500 px-5 py-3.5 text-sm font-semibold text-[#090A0D] transition-colors duration-150 hover:bg-amber-400 active:scale-[0.99] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0D]"
              >
                <span className="font-mono tracking-tight">{SERVER_CONFIG.ip}</span>
                <span className="inline-flex items-center gap-1.5 border-l border-[#090A0D]/20 pl-3">
                  {copiedIp ? (
                    <>
                      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Copy IP</span>
                    </>
                  )}
                </span>
              </button>

              <a
                href={SERVER_CONFIG.owner.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#111318]/80 px-5 py-3.5 text-sm font-medium text-[#F4F3EE] transition-colors duration-150 hover:border-amber-400/50 hover:bg-[#171A21] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span>Join Discord Server</span>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width 4-column Live Telemetry Strip below the hero */}
      <div className="border-t border-white/[0.08] bg-[#0D0F14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
            {/* 1. Real Live Server State */}
            <div className="py-5 sm:pr-6 lg:px-6 first:lg:pl-0 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-400">Server Status</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      loading || isSleeping
                        ? 'bg-amber-400'
                        : isOnline
                          ? 'bg-emerald-400'
                          : 'bg-rose-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-display text-lg font-semibold text-[#F4F3EE]">
                    {loading
                      ? 'Checking…'
                      : isSleeping
                        ? 'Sleeping'
                        : isOnline
                          ? 'Online'
                          : 'Offline'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 font-mono">
                  {isSleeping
                    ? 'Join to auto-start'
                    : status?.edition === 'bedrock'
                      ? 'Bedrock :19132'
                      : 'Java :25565'}
                </p>
              </div>
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                aria-label="Refresh live server status"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-white disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? 'animate-spin text-amber-400' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* 2. Players Online */}
            <div className="py-5 sm:pl-6 lg:px-6">
              <p className="text-xs text-zinc-400">Players Online</p>
              <p className="mt-1.5 font-mono text-lg font-semibold text-[#F4F3EE] tabular-nums">
                {loading
                  ? '— / —'
                  : isOnline || isSleeping
                    ? `${onlineCount} / ${maxCount || '—'}`
                    : '0 / 0'}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {loading
                  ? 'Querying play.glowsmp.bond'
                  : isSleeping
                    ? 'Server asleep — connect to wake'
                    : isOnline
                      ? status?.players.list.length
                        ? `${status.players.list.length} listed in live roster`
                        : onlineCount > 0
                          ? 'Active players on server'
                          : 'Server open for players'
                      : 'Waiting for server wake-up'}
              </p>
            </div>

            {/* 3. Live Detected Version */}
            <div className="py-5 sm:pr-6 lg:px-6">
              <p className="text-xs text-zinc-400">Game Version</p>
              <p className="mt-1.5 font-display text-lg font-semibold text-[#F4F3EE] truncate">
                {status?.version || '1.20.4 – 1.21.4'}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {status?.software ? `${status.software} engine` : 'Java & Bedrock supported'}
              </p>
            </div>

            {/* 4. Owner Presence */}
            <div className="py-5 sm:pl-6 lg:pl-6">
              <p className="text-xs text-zinc-400">Server Owner</p>
              <p className="mt-1.5 font-mono text-lg font-semibold text-amber-400 truncate">
                {SERVER_CONFIG.owner.minecraftUsername}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {status?.ownerOnline
                  ? 'Online in-game right now'
                  : `Discord: ${SERVER_CONFIG.owner.discordUsername}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
