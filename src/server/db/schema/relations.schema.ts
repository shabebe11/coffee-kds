import { relations } from "drizzle-orm";
import { orders } from "./orders.schema";
import { coffees } from "./coffees.schema";
import { extras } from "./extras.schema";

export const ordersRelations = relations(orders, ({ many }) => ({
  coffees: many(coffees),
}));

export const coffeesRelations = relations(coffees, ({ one, many }) => ({
  order: one(orders, { fields: [coffees.orderId], references: [orders.orderId] }),
  extras: many(extras),
}));

export const extrasRelations = relations(extras, ({ one }) => ({
  coffee: one(coffees, { fields: [extras.coffeeId], references: [coffees.coffeeId] }),
}));
