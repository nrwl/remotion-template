import React from 'react';
import { radii } from '@remotion-template/theme';

/** Rounded-square logo mark with a geometric glyph. Presentational only. */
export const LogoMark: React.FC<{ color: string; size?: number }> = ({
  color,
  size = 80,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radii.card,
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 ${size * 0.75}px ${color}66`,
    }}
  >
    <svg width={size / 2} height={size / 2} viewBox="0 0 40 40" fill="none">
      <path d="M8 20L20 8L32 20L20 32L8 20Z" fill="white" />
      <path d="M14 20L20 14L26 20L20 26L14 20Z" fill={color} />
    </svg>
  </div>
);
