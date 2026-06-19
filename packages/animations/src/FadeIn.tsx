import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeOutQuart } from './easings';

interface FadeInProps {
  children: React.ReactNode;
  /** Frame at which fade starts (default 0) */
  from?: number;
  /** Duration of the fade in frames (default 20) */
  durationInFrames?: number;
  /** Also slide up by this many px while fading in */
  slideUp?: number;
}

/**
 * Wraps children in a fade-in (+ optional slide-up) animation.
 *
 * Usage:
 *   <FadeIn from={10} durationInFrames={20} slideUp={24}>
 *     <h1>Hello</h1>
 *   </FadeIn>
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  from = 0,
  durationInFrames = 20,
  slideUp = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps; // available for timing math if needed

  const progress = interpolate(frame, [from, from + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuart,
  });

  const opacity = progress;
  const translateY = slideUp * (1 - progress);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {children}
    </div>
  );
};
