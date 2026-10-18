import { index, pgTable, text } from "drizzle-orm/pg-core";
import { orders } from "./orders.schema";

export const coffees = pgTable(
  "coffees",
  {
    coffeeId: text("coffee_id").notNull().primaryKey(),
    name: text("name").notNull(),
    milk: text("milk").notNull(),
    notes: text("notes"),
    orderId: text("order_id").notNull().references(() => orders.orderId, { onDelete: "cascade" }),
  },
  (t) => [index("coffees_order_id_idx").on(t.orderId)],
);
