import type { ComponentType } from "react";
import { generatedExamples } from "./examples.generated";

export interface Example {
  Component: ComponentType;
  /** Path from the repo root, used to show the source. */
  file: string;
}

/** Every demo in packages/ui/src/<component>/examples, keyed by file name. */
export const examples: Record<string, Example> = Object.fromEntries(
  Object.entries(generatedExamples).map(([name, { Component, path }]) => [
    name,
    { Component, file: `packages/ui/src/${path}.tsx` },
  ]),
);
