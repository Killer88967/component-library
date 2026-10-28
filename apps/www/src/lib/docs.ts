import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";

const DOCS_DIR = path.join(process.cwd(), "src/content/docs");

export interface DocMeta {
  title: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: { title: string; href: string }[];
}

/** Every doc as a slug array; `index.mdx` files map to their folder. */
export async function getDocSlugs(): Promise<string[][]> {
  const files = await readdir(DOCS_DIR, { recursive: true });

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, "").split(path.sep))
    .map((parts) => (parts.at(-1) === "index" ? parts.slice(0, -1) : parts));
}

export async function getDoc(slug: string[]) {
  const base = slug.join("/");
  const candidates = base ? [base, `${base}/index`] : ["index"];

  for (const file of candidates) {
    try {
      const mod = await import(`@/content/docs/${file}.mdx`);
      return { Content: mod.default as ComponentType, metadata: mod.metadata as DocMeta };
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

export async function getNav(): Promise<NavGroup[]> {
  const groups = new Map<string, NavGroup>();

  for (const slug of await getDocSlugs()) {
    const doc = await getDoc(slug);
    if (!doc) continue;

    const key = slug.length > 1 ? slug[0]! : "";
    const title = key ? key.charAt(0).toUpperCase() + key.slice(1) : "Getting Started";
    const group = groups.get(key) ?? { title, items: [] };

    group.items.push({
      title: doc.metadata.title,
      href: `/docs/${slug.join("/")}`.replace(/\/$/, ""),
    });
    groups.set(key, group);
  }

  return [...groups.values()].map((group) => ({
    ...group,
    items: group.items.sort((a, b) => a.title.localeCompare(b.title)),
  }));
}
