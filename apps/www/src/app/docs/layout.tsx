import Link from "next/link";
import type { ReactNode } from "react";
import { getNav } from "@/lib/docs";

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const nav = await getNav();

  return (
    <div className="cl-container grid gap-10 py-10 md:grid-cols-[13rem_minmax(0,1fr)]">
      <aside>
        <nav className="cl-stack text-sm md:sticky md:top-10">
          {nav.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="font-semibold">{group.title}</p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <article className="max-w-3xl min-w-0">{children}</article>
    </div>
  );
}
