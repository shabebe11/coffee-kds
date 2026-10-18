import { Suspense } from "react";
import { SettingsScreen } from "@/components/settings/settings-screen";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <Suspense fallback={<p className="text-subtle">Loading settings...</p>}>
        <SettingsScreen />
      </Suspense>
    </div>
  );
}
