import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { ComponentPreview } from "@/components/component-preview";

/** Plain text of a heading, used to build its anchor id. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

const slug = (node: ReactNode) =>
  textOf(node)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      id={slug(children)}
      className="mt-12 mb-4 scroll-mt-20 text-xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 id={slug(children)} className="mt-8 mb-3 scroll-mt-20 text-lg font-semibold" {...props}>
      {children}
    </h3>
  ),
  p: (props) => <p className="my-4 leading-7" {...props} />,
  a: (props) => <a className="font-medium text-primary underline underline-offset-4" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6" {...props} />,
  code: (props) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em]" {...props} />
  ),
  pre: CodeBlock,
  ComponentPreview,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
