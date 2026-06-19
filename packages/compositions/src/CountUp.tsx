import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FadeIn, easeOutQuart } from '@remotion-template/animations';
import { ProgressRing } from '@remotion-template/ui';
import { colors, fonts, fontSizes } from '@remotion-template/theme';

export type CountUpProps = {
  label: string;
  targetValue: number;
  unit: string;
  accentColor: string;
};

/**
 * Animated counter card - counts up from 0 to targetValue while a ring fills.
 * Good for metric reveals in demo videos.
 */
export const CountUp: React.FC<CountUpProps> = ({
  label,
  targetValue,
  unit,
  accentColor,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuart,
  });

  const currentValue = Math.round(progress * targetValue);

  return (
    <AbsoluteFill
      style={{
        background: colors.bgDeep,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.sans,
      }}
    >
      <div style={{ marginBottom: 40 }}>
        <ProgressRing progress={progress} color={accentColor}>
          <span
            style={{
              fontSize: fontSizes.metric,
              fontWeight: 800,
              color: colors.text,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {currentValue}
          </span>
          <span
            style={{
              fontSize: fontSizes.unit,
              color: accentColor,
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {unit}
          </span>
        </ProgressRing>
      </div>

      <FadeIn from={5} durationInFrames={15}>
        <p
          style={{
            fontSize: fontSizes.label,
            color: colors.textFaint,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};
