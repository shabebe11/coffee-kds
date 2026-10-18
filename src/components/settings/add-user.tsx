"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createUserMutation } from "@/hooks/user/query-options";

const inputClass =
  "min-h-14 rounded-md border-2 border-edge bg-page px-4 text-lg text-fg focus:border-fg";

export function AddUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [added, setAdded] = useState<string | null>(null);

  const add = useMutation({
    ...createUserMutation(),
    onMutate: () => setAdded(null),
    onSuccess: (_data, vars) => {
      setAdded(vars.username.trim().toLowerCase());
      setUsername("");
      setPassword("");
    },
  });

  const valid = username.trim().length >= 3 && password.length >= 8;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || add.isPending) return;
    add.mutate({ username, password });
  }

  return (
    <section
      aria-labelledby="add-user-title"
      className="flex flex-col gap-5 rounded-lg border-2 border-edge bg-surface p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="add-user-title" className="text-2xl font-bold">
          Add user
        </h2>
        <p className="text-subtle">New users can sign in on any screen.</p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="new-username" className="font-semibold">
            Username
          </label>
          <input
            id="new-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={40}
            autoComplete="off"
            className={inputClass}
          />
          <p className="text-sm text-subtle">At least 3 characters. Usernames are not case sensitive.</p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="new-password" className="font-semibold">
            Password
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            className={inputClass}
          />
          <p className="text-sm text-subtle">At least 8 characters.</p>
        </div>
        <button
          type="submit"
          disabled={!valid || add.isPending}
          className="min-h-14 rounded-md border-2 border-fg bg-fg/10 px-5 text-lg font-bold text-fg hover:bg-fg/20 disabled:cursor-not-allowed disabled:border-edge disabled:bg-transparent disabled:text-subtle"
        >
          {add.isPending ? "Adding..." : "Add user"}
        </button>
      </form>
      <div aria-live="polite">
        {added && <p className="font-semibold">Added user {added}</p>}
        {add.isError && (
          <p role="alert" className="font-semibold text-alert">
            The user was not added. The username may already be taken.
          </p>
        )}
      </div>
    </section>
  );
}
