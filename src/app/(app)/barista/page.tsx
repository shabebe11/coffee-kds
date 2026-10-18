import { Suspense } from "react";
import { BaristaScreen } from "@/components/barista/barista-screen";

export default function BaristaPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 md:min-h-0 md:overflow-hidden">
      <Suspense fallback={<p className="text-subtle">Loading orders...</p>}>
        <BaristaScreen />
      </Suspense>
    </div>
  );
}
