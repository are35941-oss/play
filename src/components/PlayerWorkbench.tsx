import { useMemo, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Search } from 'lucide-react';
import {
  SERVER_CONFIG,
  SMP_COMMANDS,
  SMP_RULES,
  type SmpCommand,
  type SmpRule,
} from '../data/smpData';

export type WorkbenchTab = 'join' | 'commands' | 'rules' | 'apply';

interface PlayerWorkbenchProps {
  activeTab: WorkbenchTab;
  onTabChange: (tab: WorkbenchTab) => void;
  onCopyText: (value: string, key: string) => void;
  copiedKey: string | null;
}

export function PlayerWorkbench({
  activeTab,
  onTabChange,
  onCopyText,
  copiedKey,
}: PlayerWorkbenchProps) {
  const [commandCategory, setCommandCategory] = useState<'All' | SmpCommand['category']>('All');
  const [commandSearch, setCommandSearch] = useState('');
  const [ruleCategory, setRuleCategory] = useState<'All' | SmpRule['category']>('All');

  // Application form state
  const [ign, setIgn] = useState('');
  const [platform, setPlatform] = useState<'Java Edition' | 'Bedrock / MCPE'>('Java Edition');
  const [discordTag, setDiscordTag] = useState('');
  const [applyType, setApplyType] = useState<'Clan Registration' | 'Helper / Staff' | 'Creator Partner'>(
    'Clan Registration',
  );
  const [aboutText, setAboutText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formattedApplication, setFormattedApplication] = useState<string | null>(null);

  const filteredCommands = useMemo(() => {
    const q = commandSearch.trim().toLowerCase();
    return SMP_COMMANDS.filter((item) => {
      const catMatch = commandCategory === 'All' || item.category === commandCategory;
      const textMatch =
        !q ||
        item.command.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [commandCategory, commandSearch]);

  const filteredRules = useMemo(() => {
    return SMP_RULES.filter((r) => ruleCategory === 'All' || r.category === ruleCategory);
  }, [ruleCategory]);

  const handleApplicationSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanIgn = ign.trim();
    const cleanDiscord = discordTag.trim();
    const cleanAbout = aboutText.trim();

    if (cleanIgn.length < 3 || !/^[a-zA-Z0-9_.*-]+$/.test(cleanIgn)) {
      setFormError('Enter a valid Minecraft username (at least 3 characters, no spaces).');
      return;
    }
    if (cleanDiscord.length < 2) {
      setFormError('Enter your Discord username so staff can reach you.');
      return;
    }
    if (cleanAbout.length < 15) {
      setFormError('Tell us a bit more (at least 15 characters) about your clan or experience.');
      return;
    }

    setFormError(null);
    const ticket = [
      `GlowSMP S2 — ${applyType}`,
      `Minecraft IGN: ${cleanIgn}`,
      `Edition: ${platform}`,
      `Discord: ${cleanDiscord}`,
      `Server IP: ${SERVER_CONFIG.ip}`,
      `Details: ${cleanAbout}`,
    ].join('\n');

    setFormattedApplication(ticket);
  };

  return (
    <section id="guides" className="py-20 lg:py-24 border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-amber-400">Player Handbook &amp; Utilities</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F3EE]">
              Everything you need before spawning in
            </h2>
          </div>

          {/* Functional Segmented Tab Bar */}
          <div
            role="tablist"
            aria-label="Player handbook sections"
            className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-white/[0.08] bg-[#111318] p-1"
          >
            {(
              [
                { id: 'join', label: 'How to Join' },
                { id: 'commands', label: 'Commands' },
                { id: 'rules', label: 'Server Rules' },
                { id: 'apply', label: 'Clan & Staff Form' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-[#090A0D] font-semibold'
                    : 'text-zinc-400 hover:text-[#F4F3EE]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Anchor target for Rules link in navbar */}
        <div id="rules" className="sr-only" aria-hidden="true" />

        {/* TAB 1: HOW TO JOIN */}
        {activeTab === 'join' && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Java Edition */}
            <div className="rounded-xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs text-zinc-400">PC · Windows, macOS, Linux</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#F4F3EE]">
                  Java Edition Setup
                </h3>

                <ol className="mt-6 space-y-4 text-sm text-zinc-300">
                  <li className="flex gap-3">
                    <span className="font-mono text-amber-400 shrink-0">01.</span>
                    <span>
                      Launch Minecraft Java Edition (<span className="text-[#F4F3EE]">1.20.4 – 1.21.4</span>) and open{' '}
                      <span className="text-[#F4F3EE]">Multiplayer</span>.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-amber-400 shrink-0">02.</span>
                    <span>
                      Click <span className="text-[#F4F3EE]">Add Server</span> and enter{' '}
                      <span className="font-mono text-amber-300">GlowSMP S2</span> as the server name.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-amber-400 shrink-0">03.</span>
                    <span>
                      Paste <span className="font-mono text-amber-300">{SERVER_CONFIG.ip}</span> into
                      Server Address, save, and join the realm.
                    </span>
                  </li>
                </ol>
              </div>

              <div className="mt-8 pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-xs text-zinc-400">
                  Address: <span className="text-[#F4F3EE]">{SERVER_CONFIG.ip}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopyText(SERVER_CONFIG.ip, 'join-java-ip')}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-[#090A0D] hover:bg-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedKey === 'join-java-ip' ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copied Java IP</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy Java IP</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bedrock / MCPE Edition */}
            <div className="rounded-xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs text-zinc-400">Mobile &amp; Console · Android, iOS, Xbox, PS, Switch</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#F4F3EE]">
                  Bedrock &amp; MCPE Setup
                </h3>

                <ol className="mt-6 space-y-4 text-sm text-zinc-300">
                  <li className="flex gap-3">
                    <span className="font-mono text-amber-400 shrink-0">01.</span>
                    <span>
                      Open Minecraft Bedrock Edition, go to <span className="text-[#F4F3EE]">Play</span>{' '}
                      and switch to the <span className="text-[#F4F3EE]">Servers</span> tab.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-amber-400 shrink-0">02.</span>
                    <span>
                      Tap <span className="text-[#F4F3EE]">Add Server</span>, set Server Address to{' '}
                      <span className="font-mono text-amber-300">{SERVER_CONFIG.ip}</span>.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-amber-400 shrink-0">03.</span>
                    <span>
                      Keep the default Bedrock Port <span className="font-mono text-amber-300">{SERVER_CONFIG.bedrockPort}</span>,
                      tap Save, and connect.
                    </span>
                  </li>
                </ol>
              </div>

              <div className="mt-8 pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-xs text-zinc-400 tabular-nums">
                  Port: <span className="text-[#F4F3EE]">{SERVER_CONFIG.bedrockPort}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onCopyText(SERVER_CONFIG.ip, 'join-bedrock-ip')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-[#181B22] px-3.5 py-2 text-xs font-medium text-[#F4F3EE] hover:border-amber-400/50 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'join-bedrock-ip' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                        <span>IP Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                        <span>Copy IP</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onCopyText(SERVER_CONFIG.bedrockPort, 'join-bedrock-port')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-[#181B22] px-3.5 py-2 text-xs font-medium text-[#F4F3EE] hover:border-amber-400/50 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'join-bedrock-port' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                        <span>Port Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                        <span>Copy Port</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMMANDS DIRECTORY */}
        {activeTab === 'commands' && (
          <div className="mt-10 rounded-xl border border-white/[0.08] bg-[#111318] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Essential', 'Claims', 'Economy', 'Combat'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCommandCategory(cat)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      commandCategory === cat
                        ? 'bg-amber-500 text-[#090A0D] font-semibold'
                        : 'bg-[#171A23] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Search commands…"
                  aria-label="Search GlowSMP commands"
                  className="w-full rounded-lg border border-white/10 bg-[#0B0C10] py-2 pl-9 pr-3 text-xs text-[#F4F3EE] placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 divide-y divide-white/[0.06]">
              {filteredCommands.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-400">
                  No commands match your search.
                </p>
              ) : (
                filteredCommands.map((cmd) => {
                  const key = `cmd-${cmd.command}`;
                  const copied = copiedKey === key;
                  return (
                    <div
                      key={cmd.command}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <span className="font-mono text-sm font-semibold text-amber-400">
                            {cmd.usage}
                          </span>
                          <span aria-hidden="true" className="text-zinc-600">·</span>
                          <span className="text-xs text-zinc-400">{cmd.category}</span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-300">{cmd.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCopyText(cmd.command, key)}
                        className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-lg border border-white/10 bg-[#171A23] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-amber-400/50 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SERVER RULES */}
        {activeTab === 'rules' && (
          <div className="mt-10 rounded-xl border border-white/[0.08] bg-[#111318] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Fair Play', 'Claims & PvP', 'Community', 'Economy'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRuleCategory(cat)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      ruleCategory === cat
                        ? 'bg-amber-500 text-[#090A0D] font-semibold'
                        : 'bg-[#171A23] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-400">
                Appeals &amp; reports handled on Discord ({SERVER_CONFIG.owner.discordUsername})
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRules.map((rule) => (
                <article
                  key={rule.id}
                  className="rounded-lg border border-white/[0.06] bg-[#151821] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="font-mono text-amber-400">{rule.id}.</span>
                      <span>{rule.category}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold text-[#F4F3EE]">
                      {rule.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{rule.summary}</p>
                  </div>
                  <p className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-zinc-400">
                    Enforcement: <span className="text-zinc-200">{rule.penalty}</span>
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CLAN / STAFF APPLICATION BUILDER */}
        {activeTab === 'apply' && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleApplicationSubmit}
              className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8 space-y-5"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-[#F4F3EE]">
                  Season 2 Clan, Staff &amp; Creator Application
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Fill out your details to generate a verified application formatted for the GlowSMP
                  S2 Discord ticket channel.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="apply-ign" className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Minecraft Username (IGN)
                  </label>
                  <input
                    id="apply-ign"
                    type="text"
                    required
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    placeholder="Your Minecraft IGN"
                    className="w-full rounded-lg border border-white/10 bg-[#0B0C10] px-3.5 py-2.5 font-mono text-sm text-[#F4F3EE] placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="apply-discord" className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Discord Username
                  </label>
                  <input
                    id="apply-discord"
                    type="text"
                    required
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    placeholder="e.g. player_name"
                    className="w-full rounded-lg border border-white/10 bg-[#0B0C10] px-3.5 py-2.5 text-sm text-[#F4F3EE] placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="apply-platform" className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Minecraft Edition
                  </label>
                  <select
                    id="apply-platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as 'Java Edition' | 'Bedrock / MCPE')}
                    className="w-full rounded-lg border border-white/10 bg-[#0B0C10] px-3.5 py-2.5 text-sm text-[#F4F3EE] focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Java Edition">Java Edition (PC)</option>
                    <option value="Bedrock / MCPE">Bedrock / MCPE</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="apply-type" className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Application Type
                  </label>
                  <select
                    id="apply-type"
                    value={applyType}
                    onChange={(e) =>
                      setApplyType(
                        e.target.value as 'Clan Registration' | 'Helper / Staff' | 'Creator Partner',
                      )
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#0B0C10] px-3.5 py-2.5 text-sm text-[#F4F3EE] focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Clan Registration">Clan Registration</option>
                    <option value="Helper / Staff">Helper / Staff</option>
                    <option value="Creator Partner">YouTube / Creator Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="apply-about" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Clan Plan or Experience
                </label>
                <textarea
                  id="apply-about"
                  rows={3}
                  required
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Share your clan name, roster size, or moderation/building experience…"
                  className="w-full rounded-lg border border-white/10 bg-[#0B0C10] px-3.5 py-2.5 text-sm text-[#F4F3EE] placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-400">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-[#090A0D] hover:bg-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Generate Discord Application
              </button>
            </form>

            {/* Generated Ticket Preview */}
            <div className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#111318] p-6 sm:p-8">
              <h3 className="font-display text-lg font-semibold text-[#F4F3EE]">
                Ready-to-Post Ticket
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Copy the generated block and send it in our Discord server or DM{' '}
                <span className="font-mono text-zinc-200">{SERVER_CONFIG.owner.discordUsername}</span>.
              </p>

              <pre className="mt-4 rounded-lg border border-white/[0.06] bg-[#0B0C10] p-4 font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap min-h-[168px]">
                {formattedApplication ||
                  `GlowSMP S2 — Clan Registration\nMinecraft IGN: (awaiting input)\nEdition: Java Edition\nDiscord: (awaiting input)\nServer IP: ${SERVER_CONFIG.ip}`}
              </pre>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={!formattedApplication}
                  onClick={() =>
                    formattedApplication && onCopyText(formattedApplication, 'ticket-copy')
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-[#181B22] px-4 py-2 text-xs font-medium text-[#F4F3EE] hover:border-amber-400/50 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedKey === 'ticket-copy' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Application Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                      <span>Copy Application</span>
                    </>
                  )}
                </button>

                <a
                  href={SERVER_CONFIG.owner.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 whitespace-nowrap shrink-0"
                >
                  <span>Open Discord</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
