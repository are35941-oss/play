import { useState } from 'react';
import { Check, Copy, Menu, X } from 'lucide-react';
import { SERVER_CONFIG } from '../data/smpData';

interface NavbarProps {
  copiedIp: boolean;
  onCopyIp: () => void;
  onNavigateRules: () => void;
}

const NAV_LINKS = [
  { label: 'Live Status', href: '#status' },
  { label: 'Features', href: '#features' },
  { label: 'Guides', href: '#guides' },
  { label: 'Rules', href: '#rules' },
  { label: 'Community', href: '#community' },
];

export function Navbar({ copiedIp, onCopyIp, onNavigateRules }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (href: string) => {
    if (href === '#rules') {
      onNavigateRules();
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090A0D]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-[#F4F3EE] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
        >
          {SERVER_CONFIG.name}
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href === '#rules' ? '#guides' : link.href}
              onClick={() => handleLinkClick(link.href)}
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#F4F3EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCopyIp}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#090A0D] transition-colors duration-150 hover:bg-amber-400 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0D]"
          >
            {copiedIp ? (
              <>
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>IP Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Copy Server IP</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-white/[0.08] bg-[#0E1015] px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href === '#rules' ? '#guides' : link.href}
                onClick={() => handleLinkClick(link.href)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
