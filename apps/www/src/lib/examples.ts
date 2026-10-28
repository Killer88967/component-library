import type { ComponentType } from "react";
import ButtonDemo from "@component-library/ui/button/examples/button-demo";
import ButtonSizes from "@component-library/ui/button/examples/button-sizes";
import ButtonVariants from "@component-library/ui/button/examples/button-variants";

export interface Example {
  Component: ComponentType;
  /** Path from the repo root, used to show the source. */
  file: string;
}

export const examples: Record<string, Example> = {
  "button-demo": {
    Component: ButtonDemo,
    file: "packages/ui/src/button/examples/button-demo.tsx",
  },
  "button-variants": {
    Component: ButtonVariants,
    file: "packages/ui/src/button/examples/button-variants.tsx",
  },
  "button-sizes": {
    Component: ButtonSizes,
    file: "packages/ui/src/button/examples/button-sizes.tsx",
  },
};
