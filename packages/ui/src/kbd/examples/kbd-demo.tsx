import { Kbd, KbdGroup } from "@component-library/ui";

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>K</Kbd>
        </KbdGroup>{" "}
        to search
      </p>
    </div>
  );
}
