export type ToastType = "default" | "success" | "info" | "warning" | "error" | "loading";

export interface ToastOptions {
  description?: string;
  type?: ToastType;
  /** How long it stays, in ms. Use Infinity to keep it until dismissed. */
  duration?: number;
  action?: { label: string; onClick?: (event: MouseEvent) => void };
}

// Lucide icons, the same ones the React Toaster uses.
const ICONS: Partial<Record<ToastType, string>> = {
  success: '<circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  warning:
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  error:
    '<path d="m15 9-6 6"/><path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"/><path d="m9 9 6 6"/>',
  loading: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
};

const svg = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const VISIBLE = 3;
const GAP = 14;

function toaster() {
  let list = document.querySelector<HTMLOListElement>("ol.cl-toaster");
  if (!list) {
    list = document.createElement("ol");
    list.className = "cl-toaster";
    list.setAttribute("aria-label", "Notifications");
    list.setAttribute("aria-live", "polite");
    // Fan the stack out while the pointer is over it, like Sonner.
    list.addEventListener("pointerenter", () => {
      list!.dataset.expanded = "";
      layout(list!);
    });
    list.addEventListener("pointerleave", () => {
      delete list!.dataset.expanded;
      layout(list!);
    });
    document.body.append(list);
  }
  return list;
}

/** Positions every toast: newest at the front, older ones stacked or fanned out behind it. */
function layout(list: HTMLElement) {
  const toasts = [...list.querySelectorAll<HTMLElement>(".cl-toast:not([data-removed])")].reverse();
  const expanded = list.dataset.expanded !== undefined;
  const front = toasts[0];
  list.style.setProperty("--front-height", `${front ? Number(front.dataset.height) : 0}px`);

  let offset = 0;
  toasts.forEach((el, i) => {
    el.toggleAttribute("data-front", i === 0);
    el.toggleAttribute("data-hidden", i >= VISIBLE);
    el.style.zIndex = String(toasts.length - i);
    const y = expanded ? -offset : -i * GAP;
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--scale", expanded ? "1" : String(1 - i * 0.05));
    offset += Number(el.dataset.height) + GAP;
  });
  list.style.setProperty("--expanded-height", `${Math.max(0, offset - GAP)}px`);
}

function dismiss(el: HTMLElement) {
  if (el.dataset.removed !== undefined) return;
  el.dataset.removed = "";
  const list = el.closest<HTMLElement>(".cl-toaster");
  if (list) layout(list);
  setTimeout(() => {
    el.remove();
    if (list && !list.querySelector(".cl-toast")) delete list.dataset.expanded;
  }, 200);
}

/** Shows a toast. Returns a function that dismisses it. */
export function toast(title: string, options: ToastOptions = {}) {
  const { description, type = "default", action } = options;
  const duration = options.duration ?? (type === "loading" ? Infinity : 4000);

  const el = document.createElement("li");
  el.className = "cl-toast";
  el.dataset.type = type;
  el.setAttribute("role", type === "error" ? "alert" : "status");

  if (ICONS[type]) {
    const icon = document.createElement("div");
    icon.className = "cl-toast-icon";
    icon.innerHTML = svg(ICONS[type]!);
    el.append(icon);
  }

  const content = document.createElement("div");
  content.className = "cl-toast-content";
  const titleEl = document.createElement("div");
  titleEl.className = "cl-toast-title";
  titleEl.textContent = title;
  content.append(titleEl);
  if (description) {
    const desc = document.createElement("div");
    desc.className = "cl-toast-description";
    desc.textContent = description;
    content.append(desc);
  }
  el.append(content);

  if (action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cl-toast-action";
    button.textContent = action.label;
    button.addEventListener("click", (event) => {
      action.onClick?.(event);
      dismiss(el);
    });
    el.append(button);
  }

  const list = toaster();
  el.toggleAttribute("data-front", true);
  list.append(el);
  // Remember its natural height; stacked toasts are squeezed to the front one's.
  el.dataset.height = String(el.offsetHeight);
  layout(list);

  // Pause the timer while the pointer is over a toast.
  if (Number.isFinite(duration)) {
    let remaining = duration;
    let started = Date.now();
    let timer = setTimeout(() => dismiss(el), remaining);
    el.addEventListener("pointerenter", () => {
      clearTimeout(timer);
      remaining -= Date.now() - started;
    });
    el.addEventListener("pointerleave", () => {
      started = Date.now();
      timer = setTimeout(() => dismiss(el), Math.max(remaining, 1000));
    });
  }

  return () => dismiss(el);
}

/** Shortcuts for each type, like Sonner: toast.success("Saved"). */
toast.success = (title: string, options?: Omit<ToastOptions, "type">) =>
  toast(title, { ...options, type: "success" });
toast.info = (title: string, options?: Omit<ToastOptions, "type">) =>
  toast(title, { ...options, type: "info" });
toast.warning = (title: string, options?: Omit<ToastOptions, "type">) =>
  toast(title, { ...options, type: "warning" });
toast.error = (title: string, options?: Omit<ToastOptions, "type">) =>
  toast(title, { ...options, type: "error" });

/** <button data-toast="Saved" data-toast-description="..." data-toast-type="success"> */
export function onToastClick(target: Element) {
  const trigger = target.closest<HTMLElement>("[data-toast]");
  if (!trigger) return;
  const { toast: title, toastDescription, toastType } = trigger.dataset;
  toast(title!, { description: toastDescription, type: (toastType as ToastType) || "default" });
}
