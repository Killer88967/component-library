"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@component-library/utils";
import type { NavGroup } from "@/lib/docs";

export function DocsSidebar({ nav }: { nav: NavGroup[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 text-sm">
      {nav.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">{group.title}</p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname === item.href || undefined}
              className={cn(
                "rounded-md px-2 py-1 font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
                "data-active:bg-muted data-active:text-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
