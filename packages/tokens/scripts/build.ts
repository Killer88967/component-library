import { mkdir, writeFile } from "node:fs/promises";
import { neutral, radius, themes, type ThemeVars } from "../src/themes.ts";

const OUT = new URL("../dist/", import.meta.url);

const RADIUS_SCALE: Record<string, number> = {
  sm: 0.6,
  md: 0.8,
  lg: 1,
  xl: 1.4,
  "2xl": 1.8,
  "3xl": 2.2,
  "4xl": 2.6,
};

type Decl = [name: string, value: string];

const block = (selector: string, decls: Decl[]) =>
  `${selector} {\n${decls.map(([name, value]) => `  ${name}: ${value};`).join("\n")}\n}`;

const vars = (theme: ThemeVars): Decl[] =>
  Object.entries(theme).map(([key, value]) => [`--${key}`, value]);

// tokens.css: plain CSS variables, same names as shadcn/ui
const tokensCss = [
  block(":root", [["--radius", radius], ...vars(neutral.light)]),
  block('.dark,\n[data-theme="dark"]', vars(neutral.dark)),
].join("\n\n");

// theme.css: maps the variables onto Tailwind v4 utilities
const themeCss = [
  `@import "./tokens.css";`,
  `@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));`,
  block("@theme inline", [
    ...Object.entries(RADIUS_SCALE).map(([key, n]): Decl => [
      `--radius-${key}`,
      n === 1 ? "var(--radius)" : `calc(var(--radius) * ${n})`,
    ]),
    ...Object.keys(neutral.light).map((key): Decl => [`--color-${key}`, `var(--${key})`]),
  ]),
].join("\n\n");

// JS / JSON
const json = JSON.stringify({ radius, themes }, null, 2);

await mkdir(OUT, { recursive: true });
await Promise.all([
  writeFile(new URL("tokens.css", OUT), `${tokensCss}\n`),
  writeFile(new URL("theme.css", OUT), `${themeCss}\n`),
  writeFile(new URL("tokens.json", OUT), `${json}\n`),
  writeFile(new URL("index.js", OUT), `export const tokens = ${json};\n`),
  writeFile(new URL("index.d.ts", OUT), `export declare const tokens: ${json};\n`),
]);

console.log(`tokens built -> ${OUT.pathname}`);
