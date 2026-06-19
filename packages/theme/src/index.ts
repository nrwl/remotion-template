/**
 * Design tokens shared across every composition and app.
 *
 * Tokens are plain data (no React, no Remotion) so any layer can import them:
 * ui components, compositions, and apps. Keeping them here means a brand change
 * is one edit, not a find-and-replace across videos.
 */

export const colors = {
  bg: '#1a1a2e',
  bgDeep: '#0f0f0f',
  accent: '#3b82f6',
  accentAlt: '#22d3ee',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.65)',
  textFaint: 'rgba(255,255,255,0.55)',
  hairline: 'rgba(255,255,255,0.08)',
  grid: 'rgba(255,255,255,0.03)',
} as const;

export const fonts = {
  sans: "'Inter', 'Helvetica Neue', sans-serif",
} as const;

/** Pixel sizes tuned for 1080p output. */
export const fontSizes = {
  display: 72,
  metric: 52,
  subtitle: 28,
  label: 24,
  unit: 20,
} as const;

export const radii = {
  card: 20,
  pill: 999,
} as const;
