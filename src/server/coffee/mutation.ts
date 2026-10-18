import { db } from "../db/client";
import { coffeeType } from "../db/schema";

export async function createCoffeeType(input: string) {
    const inserted = await db.insert(coffeeType).values({ name: input }).onConflictDoNothing().returning();
    return inserted.length > 0;
}
