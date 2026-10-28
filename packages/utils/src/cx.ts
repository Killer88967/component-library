export type ClassValue =
  string | number | bigint | boolean | null | undefined | ClassValue[] | Record<string, unknown>;

/** Joins class names, skipping falsy values. Accepts strings, arrays and `{ class: condition }` objects. */
export function cx(...values: ClassValue[]): string {
  const out: string[] = [];

  for (const value of values) {
    if (!value || value === true) continue;

    if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
      out.push(String(value));
    } else if (Array.isArray(value)) {
      const inner = cx(...value);
      if (inner) out.push(inner);
    } else {
      for (const [name, enabled] of Object.entries(value)) {
        if (enabled) out.push(name);
      }
    }
  }

  return out.join(" ");
}
