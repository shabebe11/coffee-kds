import { Suspense } from "react";
import { NavBar } from "@/components/nav/nav-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <Suspense fallback={<div className="h-16 shrink-0 border-b-2 border-edge" />}>
        <NavBar />
      </Suspense>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
