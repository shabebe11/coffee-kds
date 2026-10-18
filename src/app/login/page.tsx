import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login/login-form";
import { getSession } from "@/server/auth/session";

async function LoginScreen() {
  const session = await getSession();
  if (session) redirect("/order");
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <Suspense fallback={null}>
        <LoginScreen />
      </Suspense>
    </main>
  );
}
