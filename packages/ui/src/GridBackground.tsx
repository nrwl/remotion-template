import React from 'react';
import { colors } from '@remotion-template/theme';

/** Faint grid overlay that adds depth to flat backgrounds. */
export const GridBackground: React.FC<{ size?: number; color?: string }> = ({
  size = 60,
  color = colors.grid,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
    }}
  />
);
