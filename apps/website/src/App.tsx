import React from 'react';
import { Player } from '@remotion/player';
import {
  introCardComposition,
  countUpComposition,
  toPlayerProps,
} from '@remotion-template/compositions';
import { colors, fonts } from '@remotion-template/theme';

/**
 * A minimal marketing page that embeds Remotion compositions live via <Player>.
 *
 * These are the SAME compositions `apps/social` renders to MP4 - here they play
 * interactively in the browser, with no render step, sharing one source of truth
 * from `@remotion-template/compositions`. `toPlayerProps` adapts a render-side
 * descriptor to the Player's prop names.
 */
export const App: React.FC = () => {
  return (
    <main
      style={{
        background: colors.bgDeep,
        color: colors.text,
        fontFamily: fonts.sans,
        minHeight: '100vh',
      }}
    >
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
        <p
          style={{
            color: colors.accentAlt,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: 14,
            fontWeight: 600,
            margin: 0,
          }}
        >
          Remotion + React
        </p>
        <h1 style={{ fontSize: 48, margin: '8px 0 16px', letterSpacing: '-1px' }}>
          Videos embedded live, no render step
        </h1>
        <p style={{ color: colors.textMuted, fontSize: 18, maxWidth: 640, margin: 0 }}>
          The same compositions <code>apps/social</code> renders to MP4 play here in
          the browser via <code>@remotion/player</code>.
        </p>

        <Embed>
          <Player
            {...toPlayerProps(introCardComposition)}
            controls
            autoPlay
            loop
            style={{ width: '100%' }}
          />
        </Embed>

        <Embed>
          <Player
            {...toPlayerProps(countUpComposition)}
            controls
            loop
            style={{ width: '100%' }}
          />
        </Embed>
      </section>
    </main>
  );
};

const Embed: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      borderRadius: 16,
      overflow: 'hidden',
      marginTop: 32,
      border: `1px solid ${colors.hairline}`,
    }}
  >
    {children}
  </div>
);
