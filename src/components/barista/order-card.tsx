"use client";

import { useRef, useState } from "react";
import { capitalize } from "@/lib/text";
import { milkText, minutesSince } from "./format";
import type { BoardOrder, OrderStatus } from "./types";

const LATE_MINUTES = 8;
const DRAG_THRESHOLD_PX = 10;

type DragState = { dx: number; dy: number; rect: DOMRect };

const smallButton =
  "min-h-11 rounded-md border-2 px-4 font-bold hover:bg-fg/10";

export function OrderCard({
  order,
  now,
  onMove,
  zoneAt,
  onHover,
}: {
  order: BoardOrder;
  now: number;
  onMove: (status: OrderStatus) => void;
  zoneAt: (x: number, y: number) => OrderStatus | null;
  onHover: (zone: OrderStatus | null) => void;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const minutes = minutesSince(order.orderedAt, now);
  const late = minutes !== null && minutes >= LATE_MINUTES;

  function handlePointerDown(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    start.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    const origin = start.current;
    if (!origin) return;
    const dx = e.clientX - origin.x;
    const dy = e.clientY - origin.y;
    if (!drag) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX || !slotRef.current) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDrag({ dx, dy, rect: slotRef.current.getBoundingClientRect() });
    } else {
      setDrag({ ...drag, dx, dy });
    }
    onHover(zoneAt(e.clientX, e.clientY));
  }

  function finish(e: React.PointerEvent<HTMLElement>, drop: boolean) {
    const wasDragging = drag !== null;
    start.current = null;
    setDrag(null);
    onHover(null);
    if (!wasDragging || !drop) return;
    const zone = zoneAt(e.clientX, e.clientY);
    if (zone && zone !== order.status) onMove(zone);
  }

  return (
    <div
      ref={slotRef}
      style={drag ? { height: drag.rect.height } : undefined}
      className={drag ? "rounded-lg border-2 border-dashed border-edge" : undefined}
    >
      <article
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => finish(e, true)}
        onPointerCancel={(e) => finish(e, false)}
        style={
          drag
            ? {
                position: "fixed",
                left: drag.rect.left + drag.dx,
                top: drag.rect.top + drag.dy,
                width: drag.rect.width,
                zIndex: 50,
              }
            : undefined
        }
        className={`touch-pan-y select-none rounded-lg border-2 bg-surface p-4 ${
          late ? "border-fg" : "border-edge"
        } ${drag ? "cursor-grabbing shadow-[0_12px_32px_rgb(255_255_255/0.12)]" : "cursor-grab"}`}
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-2xl font-bold">{order.name}</h3>
          {minutes !== null && (
            <span className={`text-xl tabular-nums ${late ? "font-bold" : "text-subtle"}`}>
              {minutes < 1 ? "Just in" : `${minutes} min`}
            </span>
          )}
        </div>

        <ul className="mt-3 flex flex-col gap-3">
          {order.coffees.map((coffee) => (
            <li key={coffee.coffeeId} className="flex flex-col">
              <span className="text-xl font-bold">{capitalize(coffee.name)}</span>
              <span className="text-subtle">
                {[milkText(coffee.milk), ...coffee.extras.map((x) => x.name)].join(", ")}
              </span>
              {coffee.notes && <span className="font-semibold">{coffee.notes}</span>}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {order.status === "pending" && (
            <button
              type="button"
              onClick={() => onMove("in_progress")}
              className={`${smallButton} border-fg bg-fg/10`}
            >
              Start
            </button>
          )}
          {order.status === "in_progress" && (
            <>
              <button
                type="button"
                onClick={() => onMove("pending")}
                className={`${smallButton} border-edge text-subtle`}
              >
                Back to pending
              </button>
              <button
                type="button"
                onClick={() => onMove("completed")}
                className={`${smallButton} border-fg bg-fg/10`}
              >
                Done
              </button>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
