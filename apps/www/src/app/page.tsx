import { tokens } from "@component-library/tokens";
import { Button } from "@component-library/ui";
import { ThemeToggle } from "@/components/theme-toggle";

const variants = ["primary", "secondary", "outline", "ghost", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;

export default function Home() {
  return (
    <main
      className="cl-container cl-stack py-16"
      style={{ "--cl-gap": "3rem" } as React.CSSProperties}
    >
      <header className="cl-cluster justify-between">
        <h1 className="text-3xl font-semibold">Component Library</h1>
        <ThemeToggle />
      </header>

      <section className="cl-stack">
        <h2 className="text-xl font-semibold">Button</h2>
        <div className="cl-cluster">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} className="capitalize">
              {variant}
            </Button>
          ))}
        </div>
        <div className="cl-cluster">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              Size {size}
            </Button>
          ))}
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="cl-stack">
        <h2 className="text-xl font-semibold">Colors</h2>
        {Object.entries(tokens.colors).map(([name, scale]) => (
          <div key={name} className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium capitalize">{name}</p>
            <div className="grid grid-cols-11 gap-1">
              {Object.keys(scale).map((step) => (
                <div
                  key={step}
                  title={`${name}-${step}`}
                  className="h-10 rounded-md"
                  style={{ background: `var(--cl-${name}-${step})` }}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
