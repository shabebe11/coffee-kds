"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/server/auth/action";

const initialState: LoginState = {};

const inputClass =
  "min-h-14 rounded-md border-2 border-edge bg-page px-4 text-lg text-fg focus:border-fg";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-6 rounded-lg border-2 border-edge bg-surface p-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="text-subtle">Sign in to take orders.</p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="font-semibold">
          Username
        </label>
        <input id="username" name="username" autoComplete="username" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      {state.error && (
        <p role="alert" className="font-semibold text-alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="min-h-16 rounded-md border-2 border-fg bg-fg/10 px-6 text-xl font-bold text-fg hover:bg-fg/20 disabled:cursor-not-allowed disabled:border-edge disabled:bg-transparent disabled:text-subtle"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
