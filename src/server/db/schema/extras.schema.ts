import { index, pgTable, text } from "drizzle-orm/pg-core";
import { coffees } from "./coffees.schema";

export const extras = pgTable(
  "extras",
  {
    extraId: text("extra_id").notNull().primaryKey(),
    name: text("name").notNull(),
    coffeeId: text("coffee_id").notNull().references(() => coffees.coffeeId, { onDelete: "cascade" }),
  },
  (t) => [index("extras_coffee_id_idx").on(t.coffeeId)],
);
