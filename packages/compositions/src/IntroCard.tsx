import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FadeIn, ScaleIn } from '@remotion-template/animations';
import { GridBackground, LogoMark, AccentBar } from '@remotion-template/ui';
import { colors, fonts, fontSizes } from '@remotion-template/theme';

export type IntroCardProps = {
  title: string;
  subtitle: string;
  accentColor: string;
  bgColor: string;
};

/**
 * Animated intro / title card. Adapts to any aspect ratio (centered layout +
 * useVideoConfig), so the same scene works at 16:9 and 9:16.
 *
 * Timeline (at 30fps):
 *   0-20   background gradient sweeps in
 *  10-30   logo mark scales in
 *  20-40   title fades + slides up
 *  15-45   accent bar grows
 *  35-55   subtitle fades in
 *  last 15 everything fades out
 */
export const IntroCard: React.FC<IntroCardProps> = ({
  title,
  subtitle,
  accentColor,
  bgColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const gradientProgress = interpolate(frame, [0, 20], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const barWidth = interpolate(frame, [15, 45], [0, 60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${bgColor} ${gradientProgress}%, ${colors.bgDeep} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.sans,
        opacity: fadeOut,
        overflow: 'hidden',
      }}
    >
      <GridBackground />

      <ScaleIn from={10} durationInFrames={20}>
        <div style={{ marginBottom: 32 }}>
          <LogoMark color={accentColor} />
        </div>
      </ScaleIn>

      <FadeIn from={20} durationInFrames={20} slideUp={24}>
        <h1
          style={{
            fontSize: fontSizes.display,
            fontWeight: 800,
            color: colors.text,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '-2px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
      </FadeIn>

      <div style={{ margin: '20px 0' }}>
        <AccentBar widthPct={barWidth} color={accentColor} />
      </div>

      <FadeIn from={35} durationInFrames={20} slideUp={12}>
        <p
          style={{
            fontSize: fontSizes.subtitle,
            fontWeight: 400,
            color: colors.textMuted,
            margin: 0,
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          {subtitle}
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};
