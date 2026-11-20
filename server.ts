import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_HOST = 'play.glowsmp.bond';
const OWNER_IGN = 'Tiger_God__';
const CACHE_TTL_MS = 15_000;

interface OnlinePlayer {
  name: string;
  uuid?: string;
}

interface NormalizedServerStatus {
  online: boolean;
  sleeping: boolean;
  host: string;
  ip: string | null;
  port: number;
  edition: 'java' | 'bedrock';
  players: {
    online: number;
    max: number;
    list: OnlinePlayer[];
    hiddenList: boolean;
  };
  version: string | null;
  software: string | null;
  motd: {
    clean: string[];
    raw: string[];
  };
  icon: string | null;
  latencyMs: number | null;
  ownerOnline: boolean;
  checkedAt: string;
  source: string;
  error?: string;
}

interface CacheEntry {
  expiresAt: number;
  data: NormalizedServerStatus;
}

const statusCache = new Map<string, CacheEntry>();

async function fetchJsonWithTimeout(url: string, timeoutMs = 6000): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'GlowSMP-S2-Portal/1.0 (+https://play.glowsmp.bond)',
        Accept: 'application/json',
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function normalizePlayersList(rawList: unknown): OnlinePlayer[] {
  if (!Array.isArray(rawList)) return [];
  const seen = new Set<string>();
  const players: OnlinePlayer[] = [];
  for (const item of rawList) {
    if (typeof item === 'string') {
      const cleaned = item.trim();
      if (cleaned && !seen.has(cleaned.toLowerCase())) {
        seen.add(cleaned.toLowerCase());
        players.push({ name: cleaned });
      }
    } else if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      const rawName =
        typeof record.name_clean === 'string'
          ? record.name_clean
          : typeof record.name === 'string'
            ? record.name
            : '';
      const cleaned = rawName.trim();
      if (cleaned && !seen.has(cleaned.toLowerCase())) {
        seen.add(cleaned.toLowerCase());
        players.push({
          name: cleaned,
          uuid: typeof record.uuid === 'string' ? record.uuid : undefined,
        });
      }
    }
  }
  return players;
}

function stripMinecraftFormatting(input: string): string {
  return input.replace(/§[0-9a-fk-or]/gi, '').trim();
}

async function queryMinecraftServer(edition: 'java' | 'bedrock'): Promise<NormalizedServerStatus> {
  const startedAt = Date.now();

  const mcsrvUrl =
    edition === 'bedrock'
      ? `https://api.mcsrvstat.us/bedrock/3/${SERVER_HOST}`
      : `https://api.mcsrvstat.us/3/${SERVER_HOST}`;

  const mcstatusUrl =
    edition === 'bedrock'
      ? `https://api.mcstatus.io/v2/status/bedrock/${SERVER_HOST}`
      : `https://api.mcstatus.io/v2/status/java/${SERVER_HOST}`;

  const [mcsrv, mcstatus] = await Promise.all([
    fetchJsonWithTimeout(mcsrvUrl, 6500),
    fetchJsonWithTimeout(mcstatusUrl, 6500),
  ]);

  const elapsed = Date.now() - startedAt;
  const checkedAt = new Date().toISOString();

  // Prefer whichever source reports online, or has richer player sample data
  const mcsrvOnline = Boolean(mcsrv?.online);
  const mcstatusOnline = Boolean(mcstatus?.online);
  const isOnline = mcsrvOnline || mcstatusOnline;

  if (!mcsrv && !mcstatus) {
    return {
      online: false,
      sleeping: false,
      host: SERVER_HOST,
      ip: null,
      port: edition === 'bedrock' ? 19132 : 25565,
      edition,
      players: {
        online: 0,
        max: 0,
        list: [],
        hiddenList: false,
      },
      version: null,
      software: null,
      motd: { clean: [], raw: [] },
      icon: null,
      latencyMs: null,
      ownerOnline: false,
      checkedAt,
      source: 'unavailable',
      error: 'Status providers timed out. Please retry in a few seconds.',
    };
  }

  const primary = mcstatusOnline && !mcsrvOnline ? 'mcstatus' : mcsrv ? 'mcsrvstat' : 'mcstatus';

  const mcsrvList = normalizePlayersList(mcsrv?.players?.list);
  const mcstatusList = normalizePlayersList(mcstatus?.players?.list);
  const mergedList = mcsrvList.length >= mcstatusList.length ? mcsrvList : mcstatusList;

  const onlineCount = isOnline
    ? Number(
        (mcsrvOnline ? mcsrv?.players?.online : undefined) ??
          (mcstatusOnline ? mcstatus?.players?.online : undefined) ??
          mergedList.length ??
          0,
      )
    : 0;

  const maxCount = isOnline
    ? Number(
        (mcsrvOnline ? mcsrv?.players?.max : undefined) ??
          (mcstatusOnline ? mcstatus?.players?.max : undefined) ??
          0,
      )
    : 0;

  const cleanMotdFromMcsrv: string[] = Array.isArray(mcsrv?.motd?.clean)
    ? mcsrv.motd.clean.map((line: string) => line.trim()).filter(Boolean)
    : [];

  const cleanMotdFromMcstatus: string[] =
    typeof mcstatus?.motd?.clean === 'string'
      ? mcstatus.motd.clean
          .split('\n')
          .map((line: string) => stripMinecraftFormatting(line))
          .filter(Boolean)
      : [];

  const motdClean =
    cleanMotdFromMcsrv.length > 0 ? cleanMotdFromMcsrv : cleanMotdFromMcstatus;

  const motdRaw: string[] = Array.isArray(mcsrv?.motd?.raw)
    ? mcsrv.motd.raw
    : typeof mcstatus?.motd?.raw === 'string'
      ? mcstatus.motd.raw.split('\n')
      : [];

  const versionString: string | null =
    (mcsrvOnline ? mcsrv?.version : null) ||
    (mcstatusOnline
      ? mcstatus?.version?.name_clean || mcstatus?.version?.name || null
      : null) ||
    mcsrv?.version ||
    null;

  const softwareString: string | null =
    mcsrv?.software || mcstatus?.software || null;

  const iconString: string | null =
    (typeof mcsrv?.icon === 'string' && mcsrv.icon.startsWith('data:image')
      ? mcsrv.icon
      : null) ||
    (typeof mcstatus?.icon === 'string' && mcstatus.icon.startsWith('data:image')
      ? mcstatus.icon
      : null);

  const resolvedIp: string | null =
    mcsrv?.ip || mcstatus?.ip_address || null;

  const resolvedPort = Number(
    mcsrv?.port || mcstatus?.port || (edition === 'bedrock' ? 19132 : 25565),
  );

  const ownerOnline = mergedList.some(
    (player) => player.name.toLowerCase() === OWNER_IGN.toLowerCase(),
  );

  const motdJoined = motdClean.join(' ').toLowerCase();
  const isSleeping =
    isOnline &&
    onlineCount === 0 &&
    (/asleep|join to start|currently offline|hibernat|sleeping|offline.*start/i.test(motdJoined) ||
      /mcserverhost|aternos|exaroton|sleeping/i.test(versionString || ''));

  return {
    online: isOnline && !isSleeping,
    sleeping: isSleeping,
    host: SERVER_HOST,
    ip: resolvedIp,
    port: resolvedPort,
    edition,
    players: {
      online: Number.isFinite(onlineCount) ? onlineCount : 0,
      max: Number.isFinite(maxCount) ? maxCount : 0,
      list: mergedList,
      hiddenList: isOnline && onlineCount > 0 && mergedList.length === 0,
    },
    version: versionString,
    software: softwareString,
    motd: {
      clean: motdClean,
      raw: motdRaw,
    },
    icon: iconString,
    latencyMs: isOnline ? elapsed : null,
    ownerOnline,
    checkedAt,
    source: primary === 'mcsrvstat' ? 'mcsrvstat.us' : 'mcstatus.io',
  };
}

async function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, server: SERVER_HOST, timestamp: new Date().toISOString() });
  });

  app.get('/api/server-status', async (req, res) => {
    const editionParam = req.query.edition === 'bedrock' ? 'bedrock' : 'java';
    const forceFresh = req.query.fresh === '1' || req.query.fresh === 'true';

    const cached = statusCache.get(editionParam);
    if (!forceFresh && cached && Date.now() < cached.expiresAt) {
      return res.json(cached.data);
    }

    const data = await queryMinecraftServer(editionParam);
    statusCache.set(editionParam, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      data,
    });
    return res.json(data);
  });

  app.get('/api/player-head/:username', async (req, res) => {
    const rawUsername = String(req.params.username || '').trim();
    if (!/^[a-zA-Z0-9_.*-]{2,32}$/.test(rawUsername)) {
      return res.status(400).end();
    }

    const cleanName = rawUsername.replace(/^\./, '');
    const sources = [
      `https://mc-heads.net/avatar/${encodeURIComponent(cleanName)}/64`,
      `https://minotar.net/helm/${encodeURIComponent(cleanName)}/64.png`,
    ];

    for (const url of sources) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      try {
        const upstream = await fetch(url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'GlowSMP-S2-Portal/1.0' },
        });
        clearTimeout(timer);
        if (upstream.ok) {
          const contentType = upstream.headers.get('content-type') || 'image/png';
          const buffer = Buffer.from(await upstream.arrayBuffer());
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=300');
          return res.send(buffer);
        }
      } catch {
        clearTimeout(timer);
      }
    }

    return res.status(404).end();
  });

  const isProd = process.env.NODE_ENV === 'production';
  const distDir = path.resolve(__dirname, 'dist');

  if (!isProd && !fs.existsSync(path.join(distDir, 'index.html'))) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`GlowSMP S2 server running on http://0.0.0.0:${port}`);
  });
}

createApp();
