import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { spring } from './easings';

interface ScaleInProps {
  children: React.ReactNode;
  from?: number;
  durationInFrames?: number;
  /** Scale starts from this value (default 0.8) */
  initialScale?: number;
}

/**
 * Wraps children in a spring-scale-in animation.
 */
export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  from = 0,
  durationInFrames = 24,
  initialScale = 0.8,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [from, from + durationInFrames],
    [initialScale, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: spring }
  );

  const opacity = interpolate(frame, [from, from + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ transform: `scale(${scale})`, opacity }}>
      {children}
    </div>
  );
};
