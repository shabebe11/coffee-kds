"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { capitalize } from "@/lib/text";
import { completedOrdersQuery } from "@/hooks/order/query-options";
import { milkText } from "./format";

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

export function PreviousOrders({
  open,
  onClose,
  onReopen,
}: {
  open: boolean;
  onClose: () => void;
  onReopen: (orderId: string) => void;
}) {
  const { data, isPending, isError, refetch } = useQuery({ ...completedOrdersQuery(), enabled: open });

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-page/70" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="previous-title"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col gap-4 border-l-2 border-edge bg-surface p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="previous-title" className="text-2xl font-bold">
              Previous orders
            </h2>
            <p className="text-subtle">Finished in the last 20 minutes</p>
          </div>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="min-h-11 rounded-md border-2 border-edge px-4 font-bold hover:border-fg"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isPending && <p className="text-subtle">Loading previous orders...</p>}
          {isError && (
            <div role="alert" className="flex flex-col items-start gap-3">
              <p className="font-semibold text-alert">Previous orders did not load.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="min-h-11 rounded-md border-2 border-fg px-4 font-bold hover:bg-fg/10"
              >
                Try again
              </button>
            </div>
          )}
          {data && data.length === 0 && <p className="text-subtle">No orders have been finished in the last 20 minutes.</p>}
          {data && data.length > 0 && (
            <ul className="flex flex-col divide-y divide-dashed divide-rule">
              {data.map((order) => (
                <li key={order.orderId} className="flex items-start justify-between gap-3 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-bold">{order.name}</span>
                      {order.completedAt && (
                        <span className="tabular-nums text-subtle">{timeFormat.format(new Date(order.completedAt))}</span>
                      )}
                    </div>
                    {order.coffees.map((coffee) => (
                      <span key={coffee.coffeeId} className="text-subtle">
                        <span className="font-semibold text-fg">{capitalize(coffee.name)}</span>,{" "}
                        {[milkText(coffee.milk), ...coffee.extras.map((x) => x.name)].join(", ")}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onReopen(order.orderId)}
                    className="min-h-11 shrink-0 rounded-md border-2 border-edge px-4 font-bold hover:border-fg"
                  >
                    Reopen
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
