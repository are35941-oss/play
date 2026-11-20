import { SERVER_CONFIG } from '../data/smpData';
import { ResilientImage } from './ResilientImage';

export function FeaturesBento() {
  return (
    <section id="features" className="py-20 lg:py-24 border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-amber-400">Season 2 Realm Architecture</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F3EE]">
            Vanilla+ survival tuned for long-term worlds
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-400">
            Every plugin and world mechanic in GlowSMP S2 keeps authentic survival intact while
            removing grind friction, protecting your builds, and rewarding team strategy.
          </p>
        </div>

        {/* Asymmetric 12-Column Bento Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Marquee Card (7 cols) */}
          <article className="lg:col-span-7 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111318] flex flex-col">
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <ResilientImage
                src={SERVER_CONFIG.assets.citadelKingdom}
                alt="GlowSMP Season 2 lakeside guild town with lantern-lit cobblestone streets"
                fallbackLabel="Protected Player Towns"
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-zinc-400">01 · Land Protection &amp; Player Towns</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#F4F3EE]">
                  Zero-grief claims, shared clan trusts, and death graves
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-400">
                  Protect solo cabins or sprawling lakeside guild halls with chunk claims. Earn extra
                  claim blocks simply by playing, trust teammates selectively, and recover your gear
                  safely from timed graves after tough cave runs.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                <span>60-minute death graves</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>Golden shovel claiming</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>Instant /rtp wilderness spawn</span>
              </div>
            </div>
          </article>

          {/* Secondary Visual Card (5 cols) */}
          <article className="lg:col-span-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111318] flex flex-col">
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <ResilientImage
                src={SERVER_CONFIG.assets.enchantsForge}
                alt="Obsidian enchanter forge chamber with glowing amber anvil and runes"
                fallbackLabel="Custom Glow Enchants"
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-zinc-400">02 · Progression &amp; Enchanting</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#F4F3EE]">
                  Balanced Glow Enchants &amp; Forge Upgrades
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Discover practical survival enchantments like VeinMiner, TreeFeller, Telepathy, and
                  Soulbound without pay-to-win power creep. Earn top-tier artifacts through boss
                  raids and in-game crafting.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                <span>No pay-to-win stats</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>Boss loot drops</span>
              </div>
            </div>
          </article>

          {/* Typographic Editorial Block (5 cols) */}
          <article className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs text-zinc-400">03 · Cross-Play Survival</p>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-[#F4F3EE]">
                One world across Java PC, Mobile, and Console
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Play alongside friends on Java Edition or Bedrock/MCPE using the exact same address{' '}
                <span className="font-mono text-zinc-200">{SERVER_CONFIG.ip}</span>. Combat timing,
                inventories, and land claims stay synchronized across platforms.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-400 tabular-nums">
              <span>Java :25565</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Bedrock :19132</span>
            </div>
          </article>

          {/* Typographic Editorial Block (7 cols) */}
          <article className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs text-zinc-400">04 · Player Economy &amp; Weekly Events</p>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-[#F4F3EE]">
                Auction House trading, chest shops, and weekend clan wars
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-400">
                Build automated farms, list rare enchanted books on <span className="font-mono text-zinc-200">/ah</span>,
                or trade safely face-to-face with <span className="font-mono text-zinc-200">/trade</span>.
                Every weekend, clans face off in arena skirmishes and co-op Warden raids hosted live
                with <span className="font-mono text-amber-300">{SERVER_CONFIG.owner.minecraftUsername}</span>.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-medium text-[#F4F3EE]">Player-Set Prices</p>
                <p className="mt-0.5 text-zinc-400">Supply and demand via /ah</p>
              </div>
              <div>
                <p className="font-medium text-[#F4F3EE]">Safe Trading GUI</p>
                <p className="mt-0.5 text-zinc-400">Zero scam swaps via /trade</p>
              </div>
              <div>
                <p className="font-medium text-[#F4F3EE]">Quality-of-Life</p>
                <p className="mt-0.5 text-zinc-400">Right-click crop replant &amp; path speed</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
