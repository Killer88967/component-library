"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const isDark =
      root.dataset.theme === "dark" ||
      (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = isDark ? "light" : "dark";
  }

  return (
    <button type="button" className="cl-button" data-variant="outline" onClick={toggle}>
      Toggle theme
    </button>
  );
}
