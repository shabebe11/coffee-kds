import { asc, inArray } from "drizzle-orm";
import { db } from "../db/client";

export async function fetchCurrentOrders() {
    return db.query.orders.findMany({
        where: (orders) => inArray(orders.status, ["pending", "in_progress"]),
        orderBy: (orders) => asc(orders.orderedAt),
        with: { coffees: { with: { extras: true } } },
    });
}
