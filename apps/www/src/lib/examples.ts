import type { ComponentType } from "react";
import BadgeDemo from "@component-library/ui/badge/examples/badge-demo";
import ButtonDemo from "@component-library/ui/button/examples/button-demo";
import ButtonSizes from "@component-library/ui/button/examples/button-sizes";
import ButtonVariants from "@component-library/ui/button/examples/button-variants";
import CardDemo from "@component-library/ui/card/examples/card-demo";
import CardSmall from "@component-library/ui/card/examples/card-small";
import InputDemo from "@component-library/ui/input/examples/input-demo";
import InputStates from "@component-library/ui/input/examples/input-states";
import KbdDemo from "@component-library/ui/kbd/examples/kbd-demo";
import LabelDemo from "@component-library/ui/label/examples/label-demo";
import SeparatorDemo from "@component-library/ui/separator/examples/separator-demo";
import SkeletonDemo from "@component-library/ui/skeleton/examples/skeleton-demo";
import TextareaDemo from "@component-library/ui/textarea/examples/textarea-demo";

export interface Example {
  Component: ComponentType;
  /** Path from the repo root, used to show the source. */
  file: string;
}

const example = (Component: ComponentType, path: string): Example => ({
  Component,
  file: `packages/ui/src/${path}.tsx`,
});

export const examples: Record<string, Example> = {
  "badge-demo": example(BadgeDemo, "badge/examples/badge-demo"),
  "button-demo": example(ButtonDemo, "button/examples/button-demo"),
  "button-sizes": example(ButtonSizes, "button/examples/button-sizes"),
  "button-variants": example(ButtonVariants, "button/examples/button-variants"),
  "card-demo": example(CardDemo, "card/examples/card-demo"),
  "card-small": example(CardSmall, "card/examples/card-small"),
  "input-demo": example(InputDemo, "input/examples/input-demo"),
  "input-states": example(InputStates, "input/examples/input-states"),
  "kbd-demo": example(KbdDemo, "kbd/examples/kbd-demo"),
  "label-demo": example(LabelDemo, "label/examples/label-demo"),
  "separator-demo": example(SeparatorDemo, "separator/examples/separator-demo"),
  "skeleton-demo": example(SkeletonDemo, "skeleton/examples/skeleton-demo"),
  "textarea-demo": example(TextareaDemo, "textarea/examples/textarea-demo"),
};
