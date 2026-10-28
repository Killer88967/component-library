import { Button } from "@component-library/ui";

export default function ButtonSizes() {
  return (
    <div className="cl-cluster">
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        +
      </Button>
    </div>
  );
}
