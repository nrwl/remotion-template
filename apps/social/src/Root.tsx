import React from 'react';
import { Composition } from 'remotion';
import { introCardComposition } from '@remotion-template/compositions';
import { PromoCard, promoCardDefaults } from './compositions/PromoCard';

/**
 * Standalone social videos (vertical 9:16) rendered to MP4 via `render`/`bundle`.
 * The output is files - this app has no `serve`; for the live, embedded-on-a-page
 * version of these scenes see `apps/website` (which uses @remotion/player).
 *
 * Reuses the shared IntroCard at a vertical cut by spreading its descriptor and
 * overriding id + dimensions, and adds an app-specific PromoCard locally.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        {...introCardComposition}
        id="IntroCardVertical"
        width={1080}
        height={1920}
      />
      <Composition
        id="PromoCard"
        component={PromoCard}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={promoCardDefaults}
      />
    </>
  );
};
