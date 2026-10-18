import { requireUser } from "@/server/auth/require-user";
import { fetchCurrentOrders } from "@/server/order/queries";
import { OrderBoard } from "./order-board";

export async function BaristaScreen() {
  await requireUser();
  const orders = await fetchCurrentOrders();
  return <OrderBoard initialOrders={orders} />;
}
