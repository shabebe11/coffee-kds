import { db } from "../db/client";
import { coffeeType } from "../db/schema";

export async function createCoffeeType(input: string) {
    const inserted = await db.insert(coffeeType).values({ name: input }).onConflictDoNothing().returning();
    return inserted.length > 0;
}

export async function fetchCoffeeTypes() {
    return db.select().from(coffeeType).orderBy(coffeeType.name);
}

export async function ensureCoffeeTypes(names: string[]) {
    if (names.length === 0) return;
    await db.insert(coffeeType).values(names.map((name) => ({ name }))).onConflictDoNothing();
}
