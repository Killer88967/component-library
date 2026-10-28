import { Button } from "@component-library/ui";

export default function ButtonVariants() {
  return (
    <div className="cl-cluster">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}
