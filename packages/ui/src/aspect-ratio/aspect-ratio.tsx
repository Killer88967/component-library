"use client";

// Based on shadcn/ui (MIT), "nova" style - https://ui.shadcn.com/docs/components/aspect-ratio
import type * as React from "react";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";

function AspectRatio({ ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
