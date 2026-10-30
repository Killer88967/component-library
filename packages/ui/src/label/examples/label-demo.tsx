import { Input, Label } from "@component-library/ui";

export default function LabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="label-demo-name">Name</Label>
      <Input id="label-demo-name" placeholder="Jane Doe" />
    </div>
  );
}
