import { mkdir, writeFile } from "node:fs/promises";
import { colors, font, motion, radius, shadow, spacing } from "../src/primitives.ts";
import { semantic, type SemanticTokens } from "../src/semantic.ts";

// Placeholder until the library has a name.
const PREFIX = "cl";
const OUT = new URL("../dist/", import.meta.url);

type Decl = [name: string, value: string];

const v = (name: string) => `--${PREFIX}-${name}`;
const ref = (token: string) => `var(${v(token.replace(".", "-"))})`;

const group = (prefix: string, obj: Record<string, string>): Decl[] =>
  Object.entries(obj).map(([key, value]) => [v(`${prefix}-${key}`), value]);

const alias = (twPrefix: string, ourPrefix: string, keys: string[]): Decl[] =>
  keys.map((key) => [`--${twPrefix}-${key}`, `var(${v(`${ourPrefix}-${key}`)})`]);

const block = (selector: string, decls: Decl[], indent = "") =>
  `${indent}${selector} {\n${decls
    .map(([name, value]) => `${indent}  ${name}: ${value};`)
    .join("\n")}\n${indent}}`;

const semanticDecls = (mode: SemanticTokens): Decl[] =>
  Object.entries(mode).map(([key, token]) => [v(key), ref(token)]);

// tokens.css — framework-free CSS variables
const primitives: Decl[] = [
  ...Object.entries(colors).flatMap(([name, scale]) => group(name, scale)),
  [v("spacing"), spacing.base],
  ...group("radius", radius),
  ...group("font", font),
  ...group("shadow", shadow),
  ...group("duration", motion.duration),
  ...group("ease", motion.ease),
];

const dark: Decl[] = [...semanticDecls(semantic.dark), ["color-scheme", "dark"]];

const tokensCss = [
  block(":root", [...primitives, ...semanticDecls(semantic.light), ["color-scheme", "light"]]),
  `@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"])', dark, "  ")}\n}`,
  block(':root[data-theme="dark"],\n.dark', dark),
].join("\n\n");

// theme.css — maps the variables onto Tailwind v4 utilities
const themeDecls: Decl[] = [
  ...Object.keys(semantic.light).map((key): Decl => [`--color-${key}`, `var(${v(key)})`]),
  ...Object.entries(colors).flatMap(([name, scale]) =>
    alias(`color-${name}`, name, Object.keys(scale)),
  ),
  ["--spacing", `var(${v("spacing")})`],
  ...alias("radius", "radius", Object.keys(radius)),
  ...alias("font", "font", Object.keys(font)),
  ...alias("shadow", "shadow", Object.keys(shadow)),
  ...alias("ease", "ease", Object.keys(motion.ease)),
];

const themeCss = [
  `@import "./tokens.css";`,
  `@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));`,
  block("@theme inline", themeDecls),
].join("\n\n");

// JS / JSON
const json = JSON.stringify(
  { prefix: PREFIX, colors, spacing, radius, font, shadow, motion, semantic },
  null,
  2,
);

await mkdir(OUT, { recursive: true });
await Promise.all([
  writeFile(new URL("tokens.css", OUT), `${tokensCss}\n`),
  writeFile(new URL("theme.css", OUT), `${themeCss}\n`),
  writeFile(new URL("tokens.json", OUT), `${json}\n`),
  writeFile(new URL("index.js", OUT), `export const tokens = ${json};\n`),
  writeFile(new URL("index.d.ts", OUT), `export declare const tokens: ${json};\n`),
]);

console.log(`tokens built -> ${OUT.pathname}`);
