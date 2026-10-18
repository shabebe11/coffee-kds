import { requireUser } from "@/server/auth/require-user";
import { logout } from "@/server/auth/action";
import { fetchCoffeeTypes } from "@/server/coffee/mutation";
import { OrderForm } from "./order-form";

export async function OrderScreen() {
  const user = await requireUser();
  const types = await fetchCoffeeTypes();

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">New order</h1>
        <form action={logout} className="flex items-center gap-3 text-sm text-subtle">
          <span>{user.username}</span>
          <button
            type="submit"
            className="rounded-md border-2 border-edge bg-surface px-3 py-1.5 font-semibold text-fg hover:border-fg"
          >
            Sign out
          </button>
        </form>
      </header>
      <OrderForm coffeeTypes={types.map((t) => t.name)} />
    </>
  );
}
