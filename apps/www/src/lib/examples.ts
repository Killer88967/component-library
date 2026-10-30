import type { ComponentType } from "react";
import BadgeDemo from "@component-library/ui/badge/examples/badge-demo";
import ButtonDemo from "@component-library/ui/button/examples/button-demo";
import ButtonSizes from "@component-library/ui/button/examples/button-sizes";
import ButtonVariants from "@component-library/ui/button/examples/button-variants";
import CardDemo from "@component-library/ui/card/examples/card-demo";
import CardSmall from "@component-library/ui/card/examples/card-small";
import CheckboxDemo from "@component-library/ui/checkbox/examples/checkbox-demo";
import DialogDemo from "@component-library/ui/dialog/examples/dialog-demo";
import DropdownMenuCheckboxes from "@component-library/ui/dropdown-menu/examples/dropdown-menu-checkboxes";
import DropdownMenuDemo from "@component-library/ui/dropdown-menu/examples/dropdown-menu-demo";
import InputDemo from "@component-library/ui/input/examples/input-demo";
import InputStates from "@component-library/ui/input/examples/input-states";
import KbdDemo from "@component-library/ui/kbd/examples/kbd-demo";
import LabelDemo from "@component-library/ui/label/examples/label-demo";
import PopoverDemo from "@component-library/ui/popover/examples/popover-demo";
import SelectDemo from "@component-library/ui/select/examples/select-demo";
import SeparatorDemo from "@component-library/ui/separator/examples/separator-demo";
import SkeletonDemo from "@component-library/ui/skeleton/examples/skeleton-demo";
import SonnerDemo from "@component-library/ui/sonner/examples/sonner-demo";
import SwitchDemo from "@component-library/ui/switch/examples/switch-demo";
import TabsDemo from "@component-library/ui/tabs/examples/tabs-demo";
import TabsLine from "@component-library/ui/tabs/examples/tabs-line";
import TextareaDemo from "@component-library/ui/textarea/examples/textarea-demo";
import TooltipDemo from "@component-library/ui/tooltip/examples/tooltip-demo";

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
  "checkbox-demo": example(CheckboxDemo, "checkbox/examples/checkbox-demo"),
  "dialog-demo": example(DialogDemo, "dialog/examples/dialog-demo"),
  "dropdown-menu-checkboxes": example(
    DropdownMenuCheckboxes,
    "dropdown-menu/examples/dropdown-menu-checkboxes",
  ),
  "dropdown-menu-demo": example(DropdownMenuDemo, "dropdown-menu/examples/dropdown-menu-demo"),
  "input-demo": example(InputDemo, "input/examples/input-demo"),
  "input-states": example(InputStates, "input/examples/input-states"),
  "kbd-demo": example(KbdDemo, "kbd/examples/kbd-demo"),
  "label-demo": example(LabelDemo, "label/examples/label-demo"),
  "popover-demo": example(PopoverDemo, "popover/examples/popover-demo"),
  "select-demo": example(SelectDemo, "select/examples/select-demo"),
  "separator-demo": example(SeparatorDemo, "separator/examples/separator-demo"),
  "skeleton-demo": example(SkeletonDemo, "skeleton/examples/skeleton-demo"),
  "sonner-demo": example(SonnerDemo, "sonner/examples/sonner-demo"),
  "switch-demo": example(SwitchDemo, "switch/examples/switch-demo"),
  "tabs-demo": example(TabsDemo, "tabs/examples/tabs-demo"),
  "tabs-line": example(TabsLine, "tabs/examples/tabs-line"),
  "textarea-demo": example(TextareaDemo, "textarea/examples/textarea-demo"),
  "tooltip-demo": example(TooltipDemo, "tooltip/examples/tooltip-demo"),
};
