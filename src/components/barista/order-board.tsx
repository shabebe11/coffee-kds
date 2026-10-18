"use client";

import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import {
  POLL_INTERVAL_MS,
  currentOrdersQuery,
  orderKeys,
  updateOrderStatusMutation,
} from "@/hooks/order/query-options";
import { OrderCard } from "./order-card";
import { PreviousOrders } from "./previous-orders";
import type { BoardOrder, OrderStatus } from "./types";
import { useNow } from "./use-now";

const zoneBase = "flex flex-col gap-3 rounded-lg border-2 p-3 transition-colors md:min-h-0";

export function OrderBoard({ initialOrders }: { initialOrders: BoardOrder[] }) {
  const queryClient = useQueryClient();
  const now = useNow();
  const [hover, setHover] = useState<OrderStatus | null>(null);
  const [previousOpen, setPreviousOpen] = useState(false);
  const pendingRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const updating = useIsMutating({ mutationKey: orderKeys.updateStatus }) > 0;
  const { data: orders = initialOrders } = useQuery({
    ...currentOrdersQuery(),
    initialData: initialOrders,
    refetchInterval: updating ? false : POLL_INTERVAL_MS,
  });

  const update = useMutation({
    ...updateOrderStatusMutation(),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.current });
      const previous = queryClient.getQueryData<BoardOrder[]>(orderKeys.current);
      queryClient.setQueryData<BoardOrder[]>(orderKeys.current, (old) =>
        old?.flatMap((o) => {
          if (o.orderId !== orderId) return [o];
          return status === "completed" ? [] : [{ ...o, status }];
        }),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(orderKeys.current, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });

  const zoneAt = useCallback((x: number, y: number): OrderStatus | null => {
    const zones: [OrderStatus, HTMLElement | null][] = [
      ["pending", pendingRef.current],
      ["in_progress", progressRef.current],
      ["completed", doneRef.current],
    ];
    for (const [status, el] of zones) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) continue;
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return status;
    }
    return null;
  }, []);

  const pending = orders.filter((o) => o.status === "pending");
  const inProgress = orders.filter((o) => o.status === "in_progress");

  function renderCard(order: BoardOrder) {
    return (
      <OrderCard
        key={order.orderId}
        order={order}
        now={now}
        zoneAt={zoneAt}
        onHover={setHover}
        onMove={(status) => update.mutate({ orderId: order.orderId, status })}
      />
    );
  }

  const highlight = (zone: OrderStatus) =>
    hover === zone ? "border-fg bg-fg/5" : "border-edge";

  return (
    <div className="flex flex-1 flex-col gap-4 md:min-h-0">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <button
          type="button"
          onClick={() => setPreviousOpen(true)}
          className="min-h-11 rounded-md border-2 border-fg bg-fg/10 px-4 font-bold hover:bg-fg/20"
        >
          Previous orders
        </button>
      </header>

      {update.isError && (
        <p role="alert" className="font-semibold text-alert">
          The order did not update. Check the connection and move it again.
        </p>
      )}

      <div className="grid flex-1 gap-4 md:min-h-0 md:grid-cols-[1fr_1fr_9rem] lg:grid-cols-[1fr_1fr_16rem]">
        <section aria-labelledby="pending-title" className="flex flex-col gap-3 md:min-h-0">
          <h2 id="pending-title" className="flex items-baseline gap-2 text-xl font-bold">
            Pending <span className="text-subtle tabular-nums">{pending.length}</span>
          </h2>
          <div ref={pendingRef} className={`${zoneBase} md:flex-1 md:overflow-y-auto ${highlight("pending")}`}>
            {pending.length === 0 ? <p className="text-subtle">No orders waiting.</p> : pending.map(renderCard)}
          </div>
        </section>

        <section aria-labelledby="progress-title" className="flex flex-col gap-3 md:min-h-0">
          <h2 id="progress-title" className="flex items-baseline gap-2 text-xl font-bold">
            In progress <span className="text-subtle tabular-nums">{inProgress.length}</span>
          </h2>
          <div ref={progressRef} className={`${zoneBase} md:flex-1 md:overflow-y-auto ${highlight("in_progress")}`}>
            {inProgress.length === 0 ? (
              <p className="text-subtle">
                <span className="md:hidden">Nothing in progress.</span>
                <span className="hidden md:inline">Nothing in progress. Swipe an order here to start it.</span>
              </p>
            ) : (
              inProgress.map(renderCard)
            )}
          </div>
        </section>

        <div
          ref={doneRef}
          className={`hidden items-center justify-center rounded-lg border-2 border-dashed p-3 text-center transition-colors md:flex lg:p-6 ${
            hover === "completed" ? "border-fg bg-fg/10 text-fg" : "border-edge text-subtle"
          }`}
        >
          <p className="text-lg font-bold lg:text-xl">Swipe here to finish</p>
        </div>
      </div>

      <PreviousOrders
        open={previousOpen}
        onClose={() => setPreviousOpen(false)}
        onReopen={(orderId) => update.mutate({ orderId, status: "in_progress" })}
      />
    </div>
  );
}
