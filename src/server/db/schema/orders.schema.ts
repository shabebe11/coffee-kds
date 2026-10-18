import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("statuses", ["pending", "in_progress", "completed"]);

export const orders = pgTable(
    "orders",
    {
        orderId: text("order_id").notNull().primaryKey(),
        name: text("name").notNull(),
        status: statusEnum("status").notNull().default("pending"),
        completedAt: timestamp("completed_at", { withTimezone: true }),
        orderedAt: timestamp("ordered_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [index("orders_ordered_at_idx").on(t.orderedAt)],
);
