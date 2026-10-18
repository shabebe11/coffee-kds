"use server"

import { requireUser } from "../auth/require-user";
import { createOrder } from "./mutation";
import { OrderInput, OrderInputSchema } from "./type";

export async function createOrderAction(input: OrderInput) {
    await requireUser();

    const parsed = OrderInputSchema.safeParse(input);
    if (!parsed.success) return
    await createOrder(parsed.data);
}