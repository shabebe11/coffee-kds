"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/server/auth/action";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-8 shadow dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <input
        name="username"
        placeholder="Username"
        autoComplete="username"
        required
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
