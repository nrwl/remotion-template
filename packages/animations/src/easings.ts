/**
 * Custom easing functions for Remotion animations.
 * Pass to `interpolate()` via the `easing` option.
 */

/** Cubic ease-in-out */
export const easeInOut = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Overshoot spring (slight bounce past target then settle) */
export const spring = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  if (t === 0) return 0;
  if (t === 1) return 1;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

/** Ease out quart - fast start, soft landing */
export const easeOutQuart = (t: number): number =>
  1 - Math.pow(1 - t, 4);

/** Linear - no easing */
export const linear = (t: number): number => t;
