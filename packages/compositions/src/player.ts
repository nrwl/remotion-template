import type { ComponentType } from 'react';

type Descriptor<P> = {
  component: ComponentType<P>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps: P;
};

/**
 * Adapt a composition descriptor to <Player> props.
 *
 * The render side spreads a descriptor into <Composition> (uses `width`/`height`,
 * `defaultProps`); the Player side renames them (`compositionWidth`/`Height`,
 * `inputProps`). This keeps the descriptor the single source of truth for both.
 */
export function toPlayerProps<P>(descriptor: Descriptor<P>) {
  return {
    component: descriptor.component,
    inputProps: descriptor.defaultProps,
    durationInFrames: descriptor.durationInFrames,
    fps: descriptor.fps,
    compositionWidth: descriptor.width,
    compositionHeight: descriptor.height,
  };
}
