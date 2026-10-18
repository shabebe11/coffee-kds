import type { fetchCompletedOrders, fetchCurrentOrders } from "@/server/order/queries";

export type OrderStatus = "pending" | "in_progress" | "completed";
export type BoardOrder = Awaited<ReturnType<typeof fetchCurrentOrders>>[number];
export type FinishedOrder = Awaited<ReturnType<typeof fetchCompletedOrders>>[number];
