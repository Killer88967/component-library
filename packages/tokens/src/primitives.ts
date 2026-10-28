const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const LIGHTNESS = [0.985, 0.96, 0.91, 0.84, 0.74, 0.64, 0.55, 0.47, 0.39, 0.31, 0.22];
const CHROMA = [0.1, 0.22, 0.42, 0.65, 0.85, 1, 0.95, 0.85, 0.72, 0.58, 0.42];

function scale(hue: number, chroma: number): Record<string, string> {
  return Object.fromEntries(
    STEPS.map((step, i) => [
      step,
      `oklch(${LIGHTNESS[i]} ${(chroma * CHROMA[i]!).toFixed(3)} ${hue})`,
    ]),
  );
}

export const colors = {
  neutral: scale(265, 0.015),
  brand: scale(285, 0.22),
  red: scale(25, 0.21),
  amber: scale(75, 0.17),
  green: scale(150, 0.17),
  blue: scale(255, 0.19),
};

export const spacing = { base: "0.25rem" };

export const radius: Record<string, string> = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
};

export const font: Record<string, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

export const shadow: Record<string, string> = {
  sm: "0 1px 2px oklch(0 0 0 / 0.06)",
  md: "0 4px 12px -2px oklch(0 0 0 / 0.1)",
  lg: "0 12px 32px -8px oklch(0 0 0 / 0.16)",
};

export const motion = {
  duration: { fast: "120ms", normal: "200ms", slow: "320ms" } as Record<string, string>,
  ease: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
  } as Record<string, string>,
};
