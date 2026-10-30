function select(tab: HTMLElement) {
  const list = tab.closest('[role="tablist"]');
  if (!list || tab.matches(":disabled")) return;

  for (const other of list.querySelectorAll<HTMLElement>('[role="tab"]')) {
    const selected = other === tab;
    other.setAttribute("aria-selected", String(selected));
    other.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(other.getAttribute("aria-controls") ?? "");
    if (panel) panel.hidden = !selected;
  }
}

export function onTabClick(target: Element) {
  const tab = target.closest<HTMLElement>('.cl-tabs [role="tab"]');
  if (tab) select(tab);
}

export function onTabKeyDown(event: KeyboardEvent, target: Element) {
  const tab = target.closest<HTMLElement>('.cl-tabs [role="tab"]');
  const list = tab?.closest('[role="tablist"]');
  if (!tab || !list) return;

  const vertical = list.getAttribute("aria-orientation") === "vertical";
  const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]:not(:disabled)')];
  const index = tabs.indexOf(tab);
  const keys: Record<string, number> = vertical
    ? { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: tabs.length - 1 }
    : { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };

  if (!(event.key in keys)) return;
  event.preventDefault();
  const next = tabs[(keys[event.key]! + tabs.length) % tabs.length]!;
  next.focus();
  select(next);
}

/** Makes sure only the selected tab is in the tab order. */
export function setupTabs(root: ParentNode = document) {
  for (const tab of root.querySelectorAll<HTMLElement>('.cl-tabs [role="tab"]')) {
    tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
  }
}
