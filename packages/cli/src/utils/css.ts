import path from "node:path";

/** `@import "x";` lines, in the order they appear. */
const IMPORT = /^\s*@import\s+(?:url\()?["']([^"']+)["']\)?[^;]*;\s*$/;

export function cssImports(css: string) {
  return css
    .split("\n")
    .map((line) => line.match(IMPORT)?.[1])
    .filter((spec): spec is string => Boolean(spec));
}

/**
 * Adds `@import "<spec>";` after the last existing @import (CSS requires
 * imports to come before other rules), or at the top. No-op if it's there.
 */
export function addImport(css: string, spec: string) {
  if (cssImports(css).includes(spec)) return css;
  const lines = css.split("\n");
  let last = -1;
  lines.forEach((line, i) => {
    if (IMPORT.test(line)) last = i;
  });
  if (last === -1) {
    // No imports yet: go below any leading comments and blank lines.
    while (last + 1 < lines.length && /^\s*(\/\*.*\*\/)?\s*$/.test(lines[last + 1]!)) last++;
  }
  lines.splice(last + 1, 0, `@import "${spec}";`);
  return lines.join("\n");
}

/** Drops `@import` lines for things the user's stylesheet already imports. */
export function withoutImports(css: string, existing: string[]) {
  return css
    .split("\n")
    .filter((line) => {
      const spec = line.match(IMPORT)?.[1];
      return !spec || !existing.includes(spec);
    })
    .join("\n")
    .replace(/^\n+/, "");
}

/** True when the stylesheet already defines shadcn-style theme variables. */
export function definesThemeVariables(css: string) {
  return /--primary\s*:/.test(css) && /--background\s*:/.test(css);
}

/** create-next-app's starter :root { --background; --foreground } would override our theme. */
export function hasStarterVariables(css: string) {
  return /--background\s*:/.test(css) && !/--primary\s*:/.test(css);
}

// A :root block that only sets --background/--foreground, as in the starter templates.
const STARTER_ROOT = String.raw`:root\s*\{\s*(?:--(?:background|foreground)\s*:[^;{}]+;\s*)+\}`;

/** Removes the starter's :root block and its dark-mode media query. Leaves anything else. */
export function removeStarterVariables(css: string) {
  return css
    .replace(
      new RegExp(
        String.raw`@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*${STARTER_ROOT}\s*\}\s*`,
        "g",
      ),
      "",
    )
    .replace(new RegExp(`${STARTER_ROOT}\\s*`, "g"), "");
}

/** Import path from one CSS file to another ("../styles/cl.css"), always starting with . */
export function relativeImport(fromFile: string, toFile: string) {
  const r = path.relative(path.dirname(fromFile), toFile).split(path.sep).join("/");
  return r.startsWith(".") ? r : `./${r}`;
}
