import type { WithSubquery } from "drizzle-orm";
import { db } from "../db/client";
import { coffees, extras, orders } from "../db/schema";
import { OrderInput } from "./type";

export async function createOrder(input: OrderInput){
const orderId = crypto.randomUUID();

  const coffeeRows = input.coffees.map((c) => ({
    coffeeId: crypto.randomUUID(),
    orderId,
    name: c.name,
    milk: c.milk,
    notes: c.notes,
    extras: c.extras,
  }));

  const extraRows = coffeeRows.flatMap((c) =>
    c.extras.map((name) => ({ extraId: crypto.randomUUID(), coffeeId: c.coffeeId, name })),
  );

  const newOrder = db.$with("new_order").as(
    db.insert(orders).values({ orderId, name: input.name }).returning({ orderId: orders.orderId }),
  );

  const newCoffees = db.$with("new_coffees").as(
    db
      .insert(coffees)
      .values(coffeeRows.map(({ extras: _extras, ...row }) => row))
      .returning({ coffeeId: coffees.coffeeId }),
  );

  const ctes: WithSubquery[] = [newOrder, newCoffees];
  if (extraRows.length > 0) {
    ctes.push(
      db.$with("new_extras").as(
        db.insert(extras).values(extraRows).returning({ extraId: extras.extraId }),
      ),
    );
  }

  const [created] = await db
    .with(...ctes)
    .select({ orderId: newOrder.orderId })
    .from(newOrder);

  return created.orderId;
}