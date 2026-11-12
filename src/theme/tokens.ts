/**
 * GymFlow design tokens — taken 1:1 from the "0 · Style foundation" board.
 * Use these everywhere instead of hard-coded values.
 */
export const colors = {
  ground: '#0E0F12',
  surface: '#17191E',
  raised: '#1F2229',
  tabBar: '#121418',
  border: '#2A2E36',
  borderStrong: '#3A3F49',

  text: '#F4F5F7',
  textSoft: '#C9CDD3',
  muted: '#9AA0AA',
  placeholder: '#6B717C',

  accent: '#C6F432',
  accentHover: '#DDFB7A',
  onAccent: '#0E0F12',
  warning: '#FFB547',
  danger: '#FF6B5E',
  dangerText: '#FF8A80',

  accentSoft: 'rgba(198,244,50,0.14)',
  warningSoft: 'rgba(255,181,71,0.14)',
  dangerSoft: 'rgba(255,107,94,0.14)',
  white: '#FFFFFF',
} as const;

export const fonts = {
  displayBold: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  displayMedium: 'SpaceGrotesk_500Medium',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
} as const;

export const type = {
  display: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 36, letterSpacing: -0.6 },
  title: { fontFamily: fonts.displaySemi, fontSize: 22, lineHeight: 28 },
  headline: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
} as const;

/** 4px scale. Screen gutter is 20. */
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, gutter: 20 } as const;

export const radius = { control: 14, card: 20, sheet: 28, pill: 999 } as const;

export const sizes = { touch: 44, control: 52, controlLarge: 56 } as const;
