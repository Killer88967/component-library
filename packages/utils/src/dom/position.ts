export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export interface PlaceOptions {
  side?: Side;
  align?: Align;
  /** Gap between the anchor and the floating element, in px. */
  offset?: number;
  /** Space kept free at the viewport edges, in px. */
  padding?: number;
}

const OPPOSITE: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

/**
 * Positions a fixed element next to an anchor, flipping to the other side
 * when it doesn't fit and keeping it inside the viewport.
 * Sets data-placed to the side used, plus a few CSS variables:
 * --cl-anchor-width, --cl-available-height and a transform-origin.
 */
export function place(floating: HTMLElement, anchor: Element, options: PlaceOptions = {}) {
  const { align = "center", offset = 4, padding = 8 } = options;
  let side = options.side ?? "bottom";

  const a = anchor.getBoundingClientRect();
  floating.style.setProperty("--cl-anchor-width", `${a.width}px`);
  // Layout size, not getBoundingClientRect(): the open animation scales it.
  const f = { width: floating.offsetWidth, height: floating.offsetHeight };
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const space: Record<Side, number> = {
    top: a.top - offset - padding,
    bottom: vh - a.bottom - offset - padding,
    left: a.left - offset - padding,
    right: vw - a.right - offset - padding,
  };
  const needed = side === "top" || side === "bottom" ? f.height : f.width;
  if (space[side] < needed && space[OPPOSITE[side]] > space[side]) side = OPPOSITE[side];

  let top: number;
  let left: number;

  if (side === "top" || side === "bottom") {
    top = side === "bottom" ? a.bottom + offset : a.top - offset - f.height;
    left =
      align === "start"
        ? a.left
        : align === "end"
          ? a.right - f.width
          : a.left + (a.width - f.width) / 2;
    left = Math.min(Math.max(left, padding), vw - f.width - padding);
    floating.style.setProperty("--cl-available-height", `${space[side]}px`);
  } else {
    left = side === "right" ? a.right + offset : a.left - offset - f.width;
    top =
      align === "start"
        ? a.top
        : align === "end"
          ? a.bottom - f.height
          : a.top + (a.height - f.height) / 2;
    top = Math.min(Math.max(top, padding), vh - f.height - padding);
  }

  floating.style.top = `${top}px`;
  floating.style.left = `${left}px`;
  floating.dataset.placed = side;

  // Grow from the edge that touches the anchor, like Radix does.
  const originX =
    side === "left" ? "right" : side === "right" ? "left" : `${a.left + a.width / 2 - left}px`;
  const originY =
    side === "top" ? "bottom" : side === "bottom" ? "top" : `${a.top + a.height / 2 - top}px`;
  floating.style.transformOrigin = `${originX} ${originY}`;
}
