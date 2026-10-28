import type { colors } from "./primitives.ts";

type ColorRef = `${keyof typeof colors}.${number}`;

const light = {
  background: "neutral.50",
  foreground: "neutral.950",
  surface: "neutral.100",
  "surface-foreground": "neutral.950",
  muted: "neutral.200",
  "muted-foreground": "neutral.600",
  border: "neutral.200",
  input: "neutral.300",
  ring: "brand.500",
  primary: "brand.600",
  "primary-foreground": "neutral.50",
  secondary: "neutral.200",
  "secondary-foreground": "neutral.900",
  danger: "red.600",
  "danger-foreground": "neutral.50",
  success: "green.600",
  "success-foreground": "neutral.50",
  warning: "amber.400",
  "warning-foreground": "neutral.950",
  info: "blue.600",
  "info-foreground": "neutral.50",
} satisfies Record<string, ColorRef>;

export type SemanticTokens = { [K in keyof typeof light]: ColorRef };

const dark: SemanticTokens = {
  background: "neutral.950",
  foreground: "neutral.50",
  surface: "neutral.900",
  "surface-foreground": "neutral.50",
  muted: "neutral.800",
  "muted-foreground": "neutral.400",
  border: "neutral.800",
  input: "neutral.700",
  ring: "brand.400",
  primary: "brand.500",
  "primary-foreground": "neutral.50",
  secondary: "neutral.800",
  "secondary-foreground": "neutral.100",
  danger: "red.500",
  "danger-foreground": "neutral.50",
  success: "green.500",
  "success-foreground": "neutral.950",
  warning: "amber.400",
  "warning-foreground": "neutral.950",
  info: "blue.500",
  "info-foreground": "neutral.50",
};

export const semantic = { light, dark };
