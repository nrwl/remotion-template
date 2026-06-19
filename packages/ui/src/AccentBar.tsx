import React from 'react';

/**
 * Horizontal accent bar that fades to transparent.
 * Width is driven by the caller (a frame-based value) - this stays presentational.
 */
export const AccentBar: React.FC<{ widthPct: number; color: string }> = ({
  widthPct,
  color,
}) => (
  <div
    style={{
      width: `${widthPct}%`,
      height: 4,
      background: `linear-gradient(90deg, ${color}, transparent)`,
      borderRadius: 2,
    }}
  />
);
