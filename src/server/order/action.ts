"use server"

import { requireUser } from "../auth/require-user";
import { createOrder, updateOrderStatus } from "./mutation";
import { OrderInput, OrderInputSchema } from "./type";

export async function createOrderAction(input: OrderInput) {
    await requireUser();

    const parsed = OrderInputSchema.safeParse(input);
    if (!parsed.success)  throw new Error("Invalid order");
    await createOrder(parsed.data);
}

export async function updateOrderStatusAction(orderId: string, status: "pending" | "in_progress" | "completed") {
    await requireUser();
    await updateOrderStatus(orderId, status);
}