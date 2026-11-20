import { SERVER_CONFIG } from '../data/smpData';

interface FooterProps {
  onCopyIp: () => void;
  copiedIp: boolean;
}

export function Footer({ onCopyIp, copiedIp }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/[0.06]">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-[#F4F3EE]">
              {SERVER_CONFIG.name}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Owned by <span className="font-mono text-zinc-200">{SERVER_CONFIG.owner.minecraftUsername}</span> · Discord:{' '}
              <span className="font-mono text-zinc-200">{SERVER_CONFIG.owner.discordUsername}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-400">
            <a href="#status" className="hover:text-[#F4F3EE] transition-colors">
              Live Status
            </a>
            <a href="#features" className="hover:text-[#F4F3EE] transition-colors">
              Features
            </a>
            <a href="#guides" className="hover:text-[#F4F3EE] transition-colors">
              Guides &amp; Rules
            </a>
            <a
              href={SERVER_CONFIG.owner.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4F3EE] transition-colors"
            >
              Discord
            </a>
            <a
              href={SERVER_CONFIG.owner.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4F3EE] transition-colors"
            >
              YouTube
            </a>
            <button
              type="button"
              onClick={onCopyIp}
              className="font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              {copiedIp ? 'IP Copied!' : SERVER_CONFIG.ip}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {SERVER_CONFIG.name}. All rights reserved.</p>
          <p>Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</p>
        </div>
      </div>
    </footer>
  );
}
