import { logout } from "@/server/auth/action";

export function SignOut() {
  return (
    <section
      aria-labelledby="sign-out-title"
      className="flex flex-col gap-4 rounded-lg border-2 border-edge bg-surface p-6 md:col-span-2"
    >
      <div className="flex flex-col gap-1">
        <h2 id="sign-out-title" className="text-2xl font-bold">
          Sign out
        </h2>
        <p className="text-subtle">Sign out of this device.</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="min-h-14 w-full rounded-md border-2 border-fg bg-fg/10 px-5 text-lg font-bold text-fg hover:bg-fg/20 sm:w-auto"
        >
          Sign out
        </button>
      </form>
    </section>
  );
}
