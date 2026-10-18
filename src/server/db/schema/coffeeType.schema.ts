import { pgTable, text } from "drizzle-orm/pg-core";

export const coffeeType = pgTable(
    "coffee_type",
    {
        name: text("name").notNull().primaryKey(),
    },
);