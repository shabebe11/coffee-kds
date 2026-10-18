import { requireUser } from "@/server/auth/require-user";
import { fetchCoffeeTypes } from "@/server/coffee/mutation";
import { OrderForm } from "./order-form";

export async function OrderScreen() {
  await requireUser();
  const types = await fetchCoffeeTypes();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">New order</h1>
      <OrderForm coffeeTypes={types.map((t) => t.name)} />
    </>
  );
}
