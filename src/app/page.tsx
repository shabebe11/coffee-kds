import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";

async function Entry() {
  const session = await getSession();
  return redirect(session ? "/order" : "/login");
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Entry />
    </Suspense>
  );
}
