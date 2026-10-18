import { Suspense } from "react";
import { OrderScreen } from "@/components/order/order-screen";

export default function OrderPage() {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <Suspense fallback={<p className="text-subtle">Loading the order screen...</p>}>
        <OrderScreen />
      </Suspense>
    </div>
  );
}
