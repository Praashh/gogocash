export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const SPACING = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const TYPOGRAPHY = {
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
} as const;

export const COLORS = {
  primary: {
    teal: "#2dd4bf",
    cyan: "#22d3ee",
  },
  gray: {
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
  },
} as const;

export const ANIMATION = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
} as const;
