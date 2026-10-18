import { Suspense } from "react";
import { BaristaScreen } from "@/components/barista/barista-screen";

export default function BaristaPage() {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 overflow-hidden px-4 py-4 sm:px-6">
      <Suspense fallback={<p className="text-subtle">Loading orders...</p>}>
        <BaristaScreen />
      </Suspense>
    </div>
  );
}
