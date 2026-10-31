import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type Framework = "next" | "react-router" | "vite" | "other";
export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export interface PackageJson {
  name?: string;
  packageManager?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface ProjectInfo {
  root: string;
  pkg: PackageJson;
  framework: Framework;
  react: boolean;
  /** Major version of Tailwind if it's installed. */
  tailwind: number | null;
  typescript: boolean;
  srcDir: boolean;
  packageManager: PackageManager;
  /** shadcn is set up here (components.json), so its theme variables already exist. */
  shadcn: boolean;
}

export async function readPackageJson(root: string): Promise<PackageJson> {
  return JSON.parse(await readFile(path.join(root, "package.json"), "utf8")) as PackageJson;
}

export function allDeps(pkg: PackageJson) {
  return { ...pkg.dependencies, ...pkg.devDependencies };
}

const major = (range: string | undefined) => {
  const m = range?.match(/(\d+)/);
  return m ? Number(m[1]) : null;
};

export async function detectProject(root: string): Promise<ProjectInfo> {
  const pkg = await readPackageJson(root);
  const deps = allDeps(pkg);

  const framework: Framework = deps.next
    ? "next"
    : deps["@react-router/dev"]
      ? "react-router"
      : deps.vite
        ? "vite"
        : "other";

  const tailwindRange =
    deps.tailwindcss ?? deps["@tailwindcss/postcss"] ?? deps["@tailwindcss/vite"];

  return {
    root,
    pkg,
    framework,
    react: Boolean(deps.react),
    tailwind: tailwindRange ? (major(tailwindRange) ?? 4) : null,
    typescript: existsSync(path.join(root, "tsconfig.json")),
    srcDir: existsSync(path.join(root, "src")),
    packageManager: detectPackageManager(root, pkg),
    shadcn: existsSync(path.join(root, "components.json")),
  };
}

function detectPackageManager(root: string, pkg: PackageJson): PackageManager {
  const field = pkg.packageManager?.split("@")[0];
  if (field === "pnpm" || field === "yarn" || field === "bun" || field === "npm") return field;

  // Walk up so packages inside a monorepo use the workspace's manager.
  for (let dir = root; ; dir = path.dirname(dir)) {
    if (existsSync(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
    if (existsSync(path.join(dir, "bun.lock")) || existsSync(path.join(dir, "bun.lockb")))
      return "bun";
    if (existsSync(path.join(dir, "yarn.lock"))) return "yarn";
    if (existsSync(path.join(dir, "package-lock.json"))) return "npm";
    if (path.dirname(dir) === dir) break;
  }

  const agent = process.env.npm_config_user_agent ?? "";
  if (agent.startsWith("pnpm")) return "pnpm";
  if (agent.startsWith("yarn")) return "yarn";
  if (agent.startsWith("bun")) return "bun";
  return "npm";
}

/** The usual place each framework keeps its main stylesheet. */
const GLOBALS_CANDIDATES: Record<Framework, string[]> = {
  next: ["src/app/globals.css", "app/globals.css", "src/styles/globals.css", "styles/globals.css"],
  "react-router": ["app/app.css", "app/root.css", "app/styles/app.css"],
  vite: ["src/index.css", "src/main.css", "src/app.css", "src/App.css", "src/styles/globals.css"],
  other: ["src/index.css", "src/globals.css", "src/styles/globals.css", "styles/globals.css"],
};

/**
 * Finds the stylesheet the app loads. With Tailwind, the file that imports
 * "tailwindcss" wins; otherwise the framework's usual location.
 */
export async function findGlobalsCss(info: ProjectInfo): Promise<string | null> {
  if (info.tailwind) {
    for (const file of await cssFiles(info.root)) {
      const css = await readFile(path.join(info.root, file), "utf8");
      if (/@import\s+["']tailwindcss["']/.test(css)) return file;
    }
  }
  return (
    GLOBALS_CANDIDATES[info.framework].find((f) => existsSync(path.join(info.root, f))) ?? null
  );
}

/** .css files under the usual source folders, a few levels deep. */
async function cssFiles(root: string) {
  const found: string[] = [];
  const walk = async (rel: string, depth: number) => {
    if (depth > 4) return;
    const entries = await readdir(path.join(root, rel), { withFileTypes: true }).catch(() => []);
    for (const e of entries) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      const child = path.posix.join(rel, e.name);
      if (e.isDirectory()) await walk(child, depth + 1);
      else if (e.name.endsWith(".css")) found.push(child);
    }
  };
  for (const dir of ["src", "app", "styles"]) await walk(dir, 0);
  return found.sort((a, b) => a.split("/").length - b.split("/").length);
}
