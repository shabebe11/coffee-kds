"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/order", label: "Order" },
  { href: "/barista", label: "Barista" },
  { href: "/settings", label: "Settings" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <header className="shrink-0 border-b-2 border-edge">
      <nav
        aria-label="Main"
        className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-start gap-x-6 gap-y-2 px-4 sm:px-6"
      >
        <ul className="flex items-stretch gap-2">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href} className="flex">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-16 items-center border-b-4 px-3 text-lg font-bold ${
                    active ? "border-fg text-fg" : "border-transparent text-subtle hover:text-fg"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
