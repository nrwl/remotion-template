import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FadeIn, ScaleIn } from '@remotion-template/animations';
import { GridBackground, LogoMark, AccentBar } from '@remotion-template/ui';
import { colors, fonts, fontSizes, radii } from '@remotion-template/theme';

export type PromoCardProps = {
  headline: string;
  cta: string;
  accentColor: string;
  bgColor: string;
};

/** App-specific scene. Lives in the app because it's not reused elsewhere. */
export const promoCardDefaults: PromoCardProps = {
  headline: 'Ship it in half the time',
  cta: 'Get started free',
  accentColor: colors.accentAlt,
  bgColor: colors.bg,
};

export const PromoCard: React.FC<PromoCardProps> = ({
  headline,
  cta,
  accentColor,
  bgColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const barWidth = interpolate(frame, [20, 50], [0, 70], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaScale = interpolate(frame, [70, 90], [0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${bgColor}, ${colors.bgDeep})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.sans,
        opacity: fadeOut,
        overflow: 'hidden',
        padding: 80,
      }}
    >
      <GridBackground />

      <ScaleIn from={5} durationInFrames={20}>
        <div style={{ marginBottom: 48 }}>
          <LogoMark color={accentColor} size={120} />
        </div>
      </ScaleIn>

      <FadeIn from={20} durationInFrames={20} slideUp={32}>
        <h1
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: colors.text,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '-2px',
            lineHeight: 1.05,
          }}
        >
          {headline}
        </h1>
      </FadeIn>

      <div style={{ margin: '40px 0' }}>
        <AccentBar widthPct={barWidth} color={accentColor} />
      </div>

      <FadeIn from={60} durationInFrames={20}>
        <div
          style={{
            transform: `scale(${ctaScale})`,
            background: accentColor,
            color: colors.bgDeep,
            fontSize: fontSizes.subtitle,
            fontWeight: 700,
            padding: '24px 56px',
            borderRadius: radii.pill,
          }}
        >
          {cta}
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};
