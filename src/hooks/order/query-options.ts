import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
    createOrderAction,
    fetchCompletedOrdersAction,
    fetchCurrentOrdersAction,
    updateOrderStatusAction,
} from "@/server/order/action";
import type { OrderInput } from "@/server/order/type";

export const orderKeys = {
    all: ["orders"] as const,
    current: ["orders", "current"] as const,
    completed: ["orders", "completed"] as const,
};

const POLL_INTERVAL_MS = 3000;

export const currentOrdersQuery = () =>
    queryOptions({
        queryKey: orderKeys.current,
        queryFn: () => fetchCurrentOrdersAction(),
        refetchInterval: POLL_INTERVAL_MS,
    });

export const completedOrdersQuery = () =>
    queryOptions({
        queryKey: orderKeys.completed,
        queryFn: () => fetchCompletedOrdersAction(),
    });

export const createOrderMutation = () =>
    mutationOptions({
        mutationFn: (input: OrderInput) => createOrderAction(input),
    });

export const updateOrderStatusMutation = () =>
    mutationOptions({
        mutationFn: (vars: { orderId: string; status: "pending" | "in_progress" | "completed" }) =>
            updateOrderStatusAction(vars.orderId, vars.status),
    });
