import { useEffect, useState } from 'react';

interface VoxelAvatarProps {
  username: string;
  size?: number;
  isOwner?: boolean;
  className?: string;
}

function hashUsername(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

const PALETTES = [
  { skin: '#E0AC69', hair: '#2D221E', eye: '#1F2937', accent: '#F59E0B' },
  { skin: '#C68642', hair: '#18181B', eye: '#0F172A', accent: '#D97706' },
  { skin: '#F1C27D', hair: '#3B2F2F', eye: '#1E293B', accent: '#B45309' },
  { skin: '#D4A373', hair: '#1F2937', eye: '#111827', accent: '#EAB308' },
  { skin: '#E6B89C', hair: '#4A3728', eye: '#18181B', accent: '#F59E0B' },
];

export function VoxelAvatar({
  username,
  size = 40,
  isOwner = false,
  className = '',
}: VoxelAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [username]);

  const cleanName = username.trim() || 'Player';
  const palette = PALETTES[hashUsername(cleanName.toLowerCase()) % PALETTES.length];

  if (!imgFailed && cleanName.length >= 2) {
    return (
      <img
        src={`/api/player-head/${encodeURIComponent(cleanName)}`}
        alt={`${cleanName} Minecraft avatar`}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        style={{ imageRendering: 'pixelated' }}
        className={`rounded-md bg-[#181B22] object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      role="img"
      aria-label={`${cleanName} voxel head`}
      className={`rounded-md shrink-0 ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect width="8" height="8" fill={palette.skin} />
      {/* Hair / Helm */}
      <rect x="0" y="0" width="8" height="2" fill={isOwner ? '#171717' : palette.hair} />
      <rect x="0" y="2" width="1" height="2" fill={isOwner ? '#171717' : palette.hair} />
      <rect x="7" y="2" width="1" height="2" fill={isOwner ? '#171717' : palette.hair} />
      {/* Owner gold trim */}
      {isOwner && (
        <>
          <rect x="1" y="0" width="6" height="1" fill="#F59E0B" />
          <rect x="3" y="1" width="2" height="1" fill="#FBBF24" />
        </>
      )}
      {/* Eyes */}
      <rect x="1" y="4" width="1" height="1" fill="#F8FAFC" />
      <rect x="2" y="4" width="1" height="1" fill={isOwner ? '#F59E0B' : palette.eye} />
      <rect x="5" y="4" width="1" height="1" fill={isOwner ? '#F59E0B' : palette.eye} />
      <rect x="6" y="4" width="1" height="1" fill="#F8FAFC" />
      {/* Nose & Mouth */}
      <rect x="3" y="5" width="2" height="1" fill={palette.hair} opacity="0.28" />
      <rect x="3" y="6" width="2" height="1" fill={palette.hair} opacity="0.55" />
    </svg>
  );
}
