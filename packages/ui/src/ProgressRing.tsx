import React from 'react';
import { colors } from '@remotion-template/theme';

type ProgressRingProps = {
  /** 0..1 fill amount. Caller maps frame -> progress. */
  progress: number;
  color: string;
  size?: number;
  radius?: number;
  strokeWidth?: number;
  trackColor?: string;
  /** Centered content (e.g. the value + unit). */
  children?: React.ReactNode;
};

/** Circular progress ring with centered content. Presentational only. */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  color,
  size = 200,
  radius = 80,
  strokeWidth = 8,
  trackColor = colors.hairline,
  children,
}) => {
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
