/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { FeaturesBento } from './components/FeaturesBento';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { LiveServerPanel } from './components/LiveServerPanel';
import { Navbar } from './components/Navbar';
import { OwnerCommunitySection } from './components/OwnerCommunitySection';
import { PlayerWorkbench, type WorkbenchTab } from './components/PlayerWorkbench';
import { SERVER_CONFIG } from './data/smpData';
import { useServerStatus } from './hooks/useServerStatus';

export default function App() {
  const {
    edition,
    setEdition,
    status,
    loading,
    refreshing,
    error,
    refreshNow,
  } = useServerStatus('java');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeWorkbenchTab, setActiveWorkbenchTab] = useState<WorkbenchTab>('join');
  const copyTimerRef = useRef<number | null>(null);

  const handleCopyText = useCallback(async (text: string, key: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      setToastMessage(
        text.length > 42 ? 'Copied application template to clipboard' : `Copied: ${text}`,
      );

      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedKey(null);
        setToastMessage(null);
      }, 2400);
    } catch {
      setToastMessage(`Copy manually: ${text}`);
    }
  }, []);

  const handleCopyServerIp = useCallback(() => {
    handleCopyText(SERVER_CONFIG.ip, 'global-ip');
  }, [handleCopyText]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const copiedGlobalIp = copiedKey === 'global-ip';

  return (
    <div className="min-h-screen bg-[#090A0D] text-[#F4F3EE]">
      <Navbar
        copiedIp={copiedGlobalIp}
        onCopyIp={handleCopyServerIp}
        onNavigateRules={() => setActiveWorkbenchTab('rules')}
      />

      <main>
        <HeroSection
          status={status}
          loading={loading}
          refreshing={refreshing}
          copiedIp={copiedGlobalIp}
          onCopyIp={handleCopyServerIp}
          onRefresh={refreshNow}
        />

        <LiveServerPanel
          edition={edition}
          onEditionChange={setEdition}
          status={status}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={refreshNow}
          onCopyText={handleCopyText}
          copiedKey={copiedKey}
        />

        <FeaturesBento />

        <PlayerWorkbench
          activeTab={activeWorkbenchTab}
          onTabChange={setActiveWorkbenchTab}
          onCopyText={handleCopyText}
          copiedKey={copiedKey}
        />

        <OwnerCommunitySection
          ownerOnline={Boolean(status?.ownerOnline)}
          onCopyText={handleCopyText}
          copiedKey={copiedKey}
        />
      </main>

      <Footer onCopyIp={handleCopyServerIp} copiedIp={copiedGlobalIp} />

      {/* Subtle Copy Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 rounded-lg border border-amber-500/30 bg-[#14171F] px-4 py-2.5 text-xs font-medium text-[#F4F3EE] shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
