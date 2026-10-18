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
        <ul className="flex w-full items-stretch gap-1 sm:w-auto sm:gap-2">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href} className="flex flex-1 sm:flex-none">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-14 flex-1 items-center justify-center border-b-4 px-3 text-lg font-bold sm:min-h-16 sm:flex-none ${
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
