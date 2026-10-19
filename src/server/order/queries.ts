import { and, asc, desc, eq, gte, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { orders } from "../db/schema";

export async function fetchCurrentOrders() {
    return db.query.orders.findMany({
        where: (orders) => inArray(orders.status, ["pending", "in_progress"]),
        orderBy: (orders) => asc(orders.orderedAt),
        with: { coffees: { with: { extras: true } } },
    });
}

export async function fetchCompletedOrders(since: Date){
    return db.query.orders.findMany({
        where: and(eq(orders.status, "completed"), gte(orders.completedAt, since)),
        orderBy: (orders) => desc(orders.completedAt),
        with: { coffees: { with: { extras: true } } },
    });
}
