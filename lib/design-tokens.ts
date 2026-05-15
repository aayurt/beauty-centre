export const colors = {
  sage: {
    50: "#f4f7f1",
    100: "#e5ede0",
    200: "#ccdbc2",
    300: "#aec89e",
    400: "#9caf88",
    500: "#859b74",
    600: "#6e8260",
    700: "#57694c",
    800: "#404f38",
    900: "#2a3524",
  },
  pink: {
    50: "#fef7f8",
    100: "#fdf0f3",
    200: "#fbe4ea",
    300: "#f7d0da",
    400: "#f2c4ce",
    500: "#e8a0b4",
    600: "#d47a95",
    700: "#b85e7b",
    800: "#9a4d66",
    900: "#804357",
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
  white: "#ffffff",
  black: "#000000",
} as const;

export type ColorScale = keyof typeof colors.sage;

export interface SemanticColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
  border: string;
  input: string;
  ring: string;
}

export const lightSemantic: SemanticColors = {
  background: colors.white,
  foreground: "#2d2d2d",
  card: colors.white,
  cardForeground: "#2d2d2d",
  popover: colors.white,
  popoverForeground: "#2d2d2d",
  primary: colors.sage[400],
  primaryForeground: colors.white,
  secondary: colors.pink[400],
  secondaryForeground: "#2d2d2d",
  muted: colors.neutral[100],
  mutedForeground: colors.neutral[500],
  accent: colors.pink[100],
  accentForeground: "#2d2d2d",
  destructive: "#ef4444",
  destructiveForeground: colors.white,
  success: "#22c55e",
  successForeground: colors.white,
  warning: "#f59e0b",
  warningForeground: "#2d2d2d",
  info: "#3b82f6",
  infoForeground: colors.white,
  border: colors.neutral[200],
  input: colors.neutral[200],
  ring: colors.sage[400],
};

export const darkSemantic: SemanticColors = {
  background: "#1a1a1a",
  foreground: "#f0f0f0",
  card: "#262626",
  cardForeground: "#f0f0f0",
  popover: "#262626",
  popoverForeground: "#f0f0f0",
  primary: colors.sage[400],
  primaryForeground: "#1a1a1a",
  secondary: colors.pink[500],
  secondaryForeground: "#1a1a1a",
  muted: "#333333",
  mutedForeground: colors.neutral[400],
  accent: "#333333",
  accentForeground: "#f0f0f0",
  destructive: "#ef4444",
  destructiveForeground: "#f0f0f0",
  success: "#22c55e",
  successForeground: "#1a1a1a",
  warning: "#f59e0b",
  warningForeground: "#1a1a1a",
  info: "#3b82f6",
  infoForeground: "#f0f0f0",
  border: "#404040",
  input: "#404040",
  ring: colors.sage[400],
};

export const borderRadius = {
  none: "0",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "0 0 #0000",
  primary: "0 4px 14px 0 rgb(156 175 136 / 0.3)",
  "primary-lg": "0 10px 30px -5px rgb(156 175 136 / 0.35)",
  secondary: "0 4px 14px 0 rgb(242 196 206 / 0.3)",
  "secondary-lg": "0 10px 30px -5px rgb(242 196 206 / 0.35)",
} as const;

export type ShadowKey = keyof typeof shadows;

export const fonts = {
  sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
  serif: "'Playfair Display', Georgia, serif",
} as const;

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeights = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const letterSpacing = {
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
} as const;

export type SpacingKey = keyof typeof spacing;

export const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
} as const;

export type FontSizeKey = keyof typeof fontSizes;

export const opacities = {
  0: "0",
  5: "0.05",
  10: "0.1",
  15: "0.15",
  20: "0.2",
  25: "0.25",
  30: "0.3",
  35: "0.35",
  40: "0.4",
  45: "0.45",
  50: "0.5",
  55: "0.55",
  60: "0.6",
  65: "0.65",
  70: "0.7",
  75: "0.75",
  80: "0.8",
  85: "0.85",
  90: "0.9",
  95: "0.95",
  100: "1",
} as const;

export type OpacityKey = keyof typeof opacities;

export const zIndices = {
  0: "0",
  10: "10",
  20: "20",
  30: "30",
  40: "40",
  50: "50",
  auto: "auto",
} as const;

export type ZIndexKey = keyof typeof zIndices;

export const transitions = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    medium: "300ms",
    slow: "500ms",
  },
  ease: {
    out: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    in: "cubic-bezier(0.42, 0, 1, 1)",
    inOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  property: {
    default: "all",
    colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform",
  },
} as const;

export type TransitionDurationKey = keyof typeof transitions.duration;
export type TransitionEaseKey = keyof typeof transitions.ease;
export type TransitionPropertyKey = keyof typeof transitions.property;

export const theme = {
  colors,
  lightSemantic,
  darkSemantic,
  borderRadius,
  shadows,
  fonts,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  spacing,
  opacities,
  zIndices,
  transitions,
} as const;

export type Theme = typeof theme;
