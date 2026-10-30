import { Input } from "@component-library/ui";

export default function InputStates() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="Default" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Invalid" aria-invalid="true" />
      <Input type="file" />
    </div>
  );
}
