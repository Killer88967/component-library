import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "@/components/component-preview";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-4 text-xl font-semibold tracking-tight" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-lg font-semibold" {...props} />,
  p: (props) => <p className="my-4 leading-7" {...props} />,
  a: (props) => <a className="font-medium text-primary underline underline-offset-4" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6" {...props} />,
  code: (props) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em]" {...props} />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  ComponentPreview,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
