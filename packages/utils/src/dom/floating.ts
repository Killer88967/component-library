import { type Align, place, type Side } from "./position";

const FLOATING = ".cl-popover, .cl-menu";
// Radix adds the arrow's height (10px) to the tooltip's offset.
const TOOLTIP_OFFSET = 10;
const ITEM = '.cl-menu-item:not(:disabled):not([aria-disabled="true"])';

/** The element that opened a popover: its invoker button, or [data-anchor]. */
function anchorOf(el: HTMLElement): HTMLElement | null {
  const custom = el.dataset.anchor && document.getElementById(el.dataset.anchor);
  return custom || document.querySelector<HTMLElement>(`[popovertarget="${CSS.escape(el.id)}"]`);
}

function placeNextTo(el: HTMLElement, anchor: Element, side: Side, offset: number) {
  place(el, anchor, {
    side: (el.dataset.side as Side) || side,
    align: (el.dataset.align as Align) || (el.matches(".cl-menu") ? "start" : "center"),
    offset,
  });
}

// Popover and menu: position on open, keep aria-expanded in sync.

let openedWithKeyboard = false;

/** Keeps it invisible until it's been positioned, so it never flashes in the wrong spot. */
export function onFloatingBeforeToggle(event: Event) {
  const el = event.target;
  if (!(el instanceof HTMLElement) || !el.matches(FLOATING)) return;
  if ((event as ToggleEvent).newState === "open") {
    el.style.visibility = "hidden";
    el.dataset.placed = el.dataset.side || "bottom";
  }
}

export function onFloatingToggle(event: Event) {
  const el = event.target;
  if (!(el instanceof HTMLElement) || !el.matches(FLOATING)) return;

  const open = (event as ToggleEvent).newState === "open";
  const anchor = anchorOf(el);
  anchor?.setAttribute("aria-expanded", String(open));
  if (!open) return;

  if (anchor) placeNextTo(el, anchor, "bottom", 4);
  el.style.visibility = "";

  if (el.matches(".cl-menu")) {
    if (!el.hasAttribute("tabindex")) el.tabIndex = -1;
    const first = el.querySelector<HTMLElement>(ITEM);
    (openedWithKeyboard && first ? first : el).focus({ preventScroll: true });
  }
  openedWithKeyboard = false;
}

/** Re-positions open floating elements when the page scrolls or resizes. */
export function repositionOpen() {
  for (const el of document.querySelectorAll<HTMLElement>(`${FLOATING}, .cl-tooltip`)) {
    if (!el.matches(":popover-open")) continue;
    const anchor = el.matches(".cl-tooltip")
      ? document.querySelector(`[aria-describedby~="${CSS.escape(el.id)}"]`)
      : anchorOf(el);
    if (anchor)
      placeNextTo(
        el,
        anchor,
        el.matches(".cl-tooltip") ? "top" : "bottom",
        el.matches(".cl-tooltip") ? TOOLTIP_OFFSET : 4,
      );
  }
}

// Menu: keyboard navigation, hover highlight, picking items.

export function onMenuKeyDown(event: KeyboardEvent, target: Element) {
  // Opening with the keyboard focuses the first item, like Radix.
  if (target.matches("[popovertarget]") && ["Enter", " ", "ArrowDown"].includes(event.key)) {
    openedWithKeyboard = true;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      (target as HTMLButtonElement).click();
    }
    return;
  }

  const menu = target.closest<HTMLElement>(".cl-menu");
  if (!menu) return;
  const items = [...menu.querySelectorAll<HTMLElement>(ITEM)];
  const index = items.indexOf(document.activeElement as HTMLElement);

  const move = (to: number) => {
    event.preventDefault();
    items[(to + items.length) % items.length]?.focus();
  };

  switch (event.key) {
    case "ArrowDown":
      return move(index + 1);
    case "ArrowUp":
      return move(index < 0 ? -1 : index - 1);
    case "Home":
      return move(0);
    case "End":
      return move(-1);
    case "Tab":
      menu.hidePopover();
      return;
    default:
      // Type a letter to jump to the next item starting with it.
      if (event.key.length === 1 && /\S/.test(event.key)) {
        const key = event.key.toLowerCase();
        const order = [...items.slice(index + 1), ...items.slice(0, index + 1)];
        order.find((item) => item.textContent?.trim().toLowerCase().startsWith(key))?.focus();
      }
  }
}

export function onMenuPointerMove(target: Element) {
  const item = target.closest<HTMLElement>(ITEM);
  if (item && item.closest(".cl-menu") && document.activeElement !== item) {
    item.focus({ preventScroll: true });
  }
}

export function onMenuPointerLeave(event: PointerEvent) {
  const menu = event.target as Element;
  if (
    menu instanceof HTMLElement &&
    menu.matches(".cl-menu") &&
    menu.contains(document.activeElement)
  ) {
    menu.focus({ preventScroll: true });
  }
}

export function onMenuClick(target: Element) {
  const item = target.closest<HTMLElement>(ITEM);
  const menu = item?.closest<HTMLElement>(".cl-menu");
  if (!item || !menu) return;

  const role = item.getAttribute("role");
  if (role === "menuitemcheckbox") {
    item.setAttribute("aria-checked", String(item.getAttribute("aria-checked") !== "true"));
  } else if (role === "menuitemradio") {
    const group = item.closest('[role="group"]') ?? menu;
    for (const radio of group.querySelectorAll('[role="menuitemradio"]')) {
      radio.setAttribute("aria-checked", String(radio === item));
    }
  }

  if (!item.hasAttribute("data-keep-open")) {
    menu.hidePopover();
    anchorOf(menu)?.focus();
  }
}

// Tooltip: shown on hover (mouse, pen) and keyboard focus.

function tooltipFor(target: Element) {
  const owner = target.closest<HTMLElement>("[aria-describedby]");
  if (!owner) return null;
  for (const id of owner.getAttribute("aria-describedby")!.split(/\s+/)) {
    const tip = document.getElementById(id);
    if (tip?.matches(".cl-tooltip")) return { owner, tip };
  }
  return null;
}

function showTooltip(owner: HTMLElement, tip: HTMLElement) {
  if (!tip.matches(":popover-open")) {
    tip.dataset.placed = tip.dataset.side || "top";
    tip.showPopover();
  }
  placeNextTo(tip, owner, "top", TOOLTIP_OFFSET);
}

function hideTooltip(tip: HTMLElement) {
  if (tip.matches(":popover-open")) tip.hidePopover();
}

export function onTooltipEnter(event: PointerEvent | FocusEvent, target: Element) {
  if (event instanceof PointerEvent && event.pointerType === "touch") return;
  if (event instanceof FocusEvent && !(target as HTMLElement).matches(":focus-visible")) return;
  const found = tooltipFor(target);
  if (found) showTooltip(found.owner, found.tip);
}

export function onTooltipLeave(event: PointerEvent | FocusEvent, target: Element) {
  const found = tooltipFor(target);
  if (!found) return;
  const next = event.relatedTarget as Node | null;
  if (next && found.owner.contains(next)) return;
  hideTooltip(found.tip);
}

export function hideAllTooltips() {
  for (const tip of document.querySelectorAll<HTMLElement>(".cl-tooltip:popover-open"))
    hideTooltip(tip);
}
