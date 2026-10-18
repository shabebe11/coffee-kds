import { MILKS } from "@/components/order/options";

export function milkText(value: string) {
  const label = MILKS.find((m) => m.value === value)?.label ?? value;
  return label === "No milk" ? label : `${label} milk`;
}

export function minutesSince(from: Date, now: number) {
  if (now === 0) return null;
  return Math.max(0, Math.floor((now - new Date(from).getTime()) / 60000));
}
