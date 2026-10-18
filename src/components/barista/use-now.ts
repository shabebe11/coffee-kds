import { useSyncExternalStore } from "react";

const TICK_MS = 30000;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, TICK_MS);
  return () => clearInterval(id);
}

function getSnapshot() {
  return Math.floor(Date.now() / TICK_MS) * TICK_MS;
}

export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}
