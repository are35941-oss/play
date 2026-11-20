import { ArrowUpRight, Check, Copy, Play } from 'lucide-react';
import { SEASON_EVENTS, SERVER_CONFIG } from '../data/smpData';
import { ResilientImage } from './ResilientImage';
import { VoxelAvatar } from './VoxelAvatar';

interface OwnerCommunitySectionProps {
  ownerOnline: boolean;
  onCopyText: (value: string, key: string) => void;
  copiedKey: string | null;
}

export function OwnerCommunitySection({
  ownerOnline,
  onCopyText,
  copiedKey,
}: OwnerCommunitySectionProps) {
  return (
    <section id="community" className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Owner Spotlight Split (items-stretch for balanced 2-column geometry) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Owner Portrait */}
          <div className="lg:col-span-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111318]">
            <ResilientImage
              src={SERVER_CONFIG.assets.ownerPortrait}
              alt="Tiger_God__, Founder and Lead Administrator of GlowSMP Season 2"
              fallbackLabel="Tiger_God__ — GlowSMP S2 Founder"
              className="h-full w-full min-h-[340px] object-cover object-top"
            />
          </div>

          {/* Right: Owner Info & Official Channels */}
          <div className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-[#111318] p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-zinc-400">
                <span className="font-medium text-amber-400">Server Founder</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{ownerOnline ? 'Online on play.glowsmp.bond' : 'Season 2 Lead Admin'}</span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <VoxelAvatar
                  username={SERVER_CONFIG.owner.minecraftUsername}
                  size={52}
                  isOwner
                  className="border border-amber-500/40"
                />
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F3EE]">
                    {SERVER_CONFIG.owner.minecraftUsername}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Creator of GlowSMP S2 · Community Host &amp; YouTube Content Creator
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm sm:text-base leading-relaxed text-zinc-300">
                Season 2 is actively managed by{' '}
                <span className="font-mono text-amber-300">
                  {SERVER_CONFIG.owner.minecraftUsername}
                </span>
                . Join the official Discord server for live event calls, clan diplomacy, support
                tickets, and direct contact, or catch full GlowSMP S2 episodes and raid highlights on
                YouTube.
              </p>

              {/* Copyable Owner Credentials */}
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/[0.07] bg-[#0B0C10] p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400">Minecraft Username</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-[#F4F3EE] truncate">
                      {SERVER_CONFIG.owner.minecraftUsername}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onCopyText(SERVER_CONFIG.owner.minecraftUsername, 'owner-mc-copy')
                    }
                    aria-label="Copy owner Minecraft username"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#151821] text-zinc-300 hover:border-amber-400/50 hover:text-white shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'owner-mc-copy' ? (
                      <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="rounded-lg border border-white/[0.07] bg-[#0B0C10] p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400">Discord Username</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-[#F4F3EE] truncate">
                      {SERVER_CONFIG.owner.discordUsername}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onCopyText(SERVER_CONFIG.owner.discordUsername, 'owner-dc-copy')
                    }
                    aria-label="Copy owner Discord username"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#151821] text-zinc-300 hover:border-amber-400/50 hover:text-white shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'owner-dc-copy' ? (
                      <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Official Links Row */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row gap-3">
              <a
                href={SERVER_CONFIG.owner.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#090A0D] transition-colors hover:bg-amber-400 whitespace-nowrap shrink-0"
              >
                <span>Join Official Discord</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href={SERVER_CONFIG.owner.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-[#181B22] px-5 py-3 text-sm font-medium text-[#F4F3EE] transition-colors hover:border-amber-400/50 hover:bg-[#1E222C] whitespace-nowrap shrink-0"
              >
                <Play className="h-4 w-4 text-amber-400" aria-hidden="true" />
                <span>YouTube ({SERVER_CONFIG.owner.youtubeHandle})</span>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Season 2 Weekend Events Schedule Strip */}
        <div className="mt-10 rounded-xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <p className="text-xs font-medium text-amber-400">Community Calendar</p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-[#F4F3EE]">
                Weekly Season 2 Events
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Event callouts posted 1 hour prior in Discord ({SERVER_CONFIG.owner.discordUsername})
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEASON_EVENTS.map((ev) => (
              <div
                key={ev.title}
                className="rounded-lg border border-white/[0.06] bg-[#151821] p-5 flex flex-col justify-between"
              >
                <div>
                  <p className="font-mono text-xs text-amber-400 tabular-nums">{ev.day}</p>
                  <h4 className="mt-2 font-display text-lg font-semibold text-[#F4F3EE]">
                    {ev.title}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400">{ev.format}</p>
                </div>
                <p className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-zinc-300">
                  Reward: <span className="text-zinc-400">{ev.reward}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
