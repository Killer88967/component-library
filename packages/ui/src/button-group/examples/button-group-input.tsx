import { SearchIcon } from "lucide-react";
import { Button, ButtonGroup, Input } from "@component-library/ui";

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  );
}
