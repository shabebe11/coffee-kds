"use server"

import { requireUser } from "../auth/require-user";
import { ensureCoffeeTypes } from "../coffee/mutation";
import { createOrder, updateOrderStatus } from "./mutation";
import { fetchCompletedOrders, fetchCurrentOrders } from "./queries";
import { OrderInput, OrderInputSchema } from "./type";

export async function createOrderAction(input: OrderInput) {
    await requireUser();

    const parsed = OrderInputSchema.safeParse(input);
    if (!parsed.success)  throw new Error("Invalid order");
    const customNames = [...new Set(parsed.data.coffees.filter((c) => c.isCustom).map((c) => c.name))];
    if (customNames.length > 0) await ensureCoffeeTypes(customNames);
    await createOrder(parsed.data);
}

export async function updateOrderStatusAction(orderId: string, status: "pending" | "in_progress" | "completed") {
    await requireUser();
    await updateOrderStatus(orderId, status);
}

export async function fetchCurrentOrdersAction(){
    await requireUser();
    return await fetchCurrentOrders();
}

export async function fetchCompletedOrdersAction(){
    await requireUser();
    return await fetchCompletedOrders();
}