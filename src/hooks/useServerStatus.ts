import { useCallback, useEffect, useRef, useState } from 'react';
import type { ServerEdition, ServerStatusResponse } from '../types/server';

const POLL_INTERVAL_MS = 30_000;

export function useServerStatus(initialEdition: ServerEdition = 'java') {
  const [edition, setEdition] = useState<ServerEdition>(initialEdition);
  const [status, setStatus] = useState<ServerStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchStatus = useCallback(
    async (targetEdition: ServerEdition, fresh = false) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (fresh) {
        setRefreshing(true);
      } else if (!status) {
        setLoading(true);
      }

      try {
        const query = new URLSearchParams({
          edition: targetEdition,
          ...(fresh ? { fresh: '1' } : {}),
        });
        const response = await fetch(`/api/server-status?${query.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Status check failed (${response.status})`);
        }
        const payload = (await response.json()) as ServerStatusResponse;
        setStatus(payload);
        setError(payload.error || null);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError('Unable to reach the live status service. Try refreshing.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [status],
  );

  useEffect(() => {
    setLoading(true);
    fetchStatus(edition, false);

    const interval = window.setInterval(() => {
      fetchStatus(edition, false);
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edition]);

  const refreshNow = useCallback(() => {
    fetchStatus(edition, true);
  }, [edition, fetchStatus]);

  return {
    edition,
    setEdition,
    status,
    loading,
    refreshing,
    error,
    refreshNow,
  };
}
