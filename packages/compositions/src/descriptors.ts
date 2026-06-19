import { colors } from '@remotion-template/theme';
import { IntroCard } from './IntroCard';
import { CountUp } from './CountUp';

/**
 * Composition *descriptors*: everything `<Composition>` needs as plain data.
 *
 * The `<Composition>` JSX itself must live in an app's registered Root (it
 * relies on Remotion's registry context), so libs export descriptors and apps
 * register them: `<Composition {...introCardComposition} />`. Apps can spread
 * then override per product, e.g. `id`, `width`/`height` for a vertical cut.
 */

export const introCardComposition = {
  id: 'IntroCard',
  component: IntroCard,
  durationInFrames: 90,
  fps: 30,
  width: 1920,
  height: 1080,
  defaultProps: {
    title: 'Your Project Title',
    subtitle: 'A short, punchy subtitle that explains what this is about',
    accentColor: colors.accent,
    bgColor: colors.bg,
  },
} as const;

export const countUpComposition = {
  id: 'CountUp',
  component: CountUp,
  durationInFrames: 90,
  fps: 30,
  width: 1920,
  height: 1080,
  defaultProps: {
    label: 'tasks saved',
    targetValue: 2847,
    unit: 'tasks',
    accentColor: colors.accentAlt,
  },
} as const;
