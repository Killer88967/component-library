import { readFile } from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";
import { examples } from "@/lib/examples";

// Examples live outside the app; keep Turbopack from tracing the whole repo.
const REPO_ROOT = path.join(/* turbopackIgnore: true */ process.cwd(), "../..");

export async function ComponentPreview({ name }: { name: string }) {
  const example = examples[name];
  if (!example) throw new Error(`Unknown example "${name}"`);

  const source = await readFile(path.join(REPO_ROOT, example.file), "utf8");
  const html = await codeToHtml(source.trim(), {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
  });

  const { Component } = example;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border">
      <div className="flex min-h-40 items-center justify-center bg-background p-8">
        <Component />
      </div>
      <div
        className="border-t border-border text-sm [&_pre]:overflow-x-auto [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
