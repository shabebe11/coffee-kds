"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { capitalize } from "@/lib/text";
import { createCoffeeTypeMutation } from "@/hooks/coffee/query-options";

const inputClass =
  "min-h-14 rounded-md border-2 border-edge bg-page px-4 text-lg text-fg focus:border-fg";

export function AddCoffeeType() {
  const [name, setName] = useState("");
  const [added, setAdded] = useState<string | null>(null);

  const add = useMutation({
    ...createCoffeeTypeMutation(),
    onSuccess: (_data, value) => {
      setAdded(value.trim().toLowerCase());
      setName("");
    },
    onMutate: () => setAdded(null),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = name.trim();
    if (!value || add.isPending) return;
    add.mutate(value);
  }

  return (
    <section
      aria-labelledby="coffee-type-title"
      className="flex flex-col gap-5 rounded-lg border-2 border-edge bg-surface p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="coffee-type-title" className="text-2xl font-bold">
          Add coffee type
        </h2>
        <p className="text-subtle">New types appear as choices on the order screen.</p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="coffee-type-name" className="font-semibold">
            Coffee name
          </label>
          <input
            id="coffee-type-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoComplete="off"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim() || add.isPending}
          className="min-h-14 rounded-md border-2 border-fg bg-fg/10 px-5 text-lg font-bold text-fg hover:bg-fg/20 disabled:cursor-not-allowed disabled:border-edge disabled:bg-transparent disabled:text-subtle"
        >
          {add.isPending ? "Adding..." : "Add coffee type"}
        </button>
      </form>
      <div aria-live="polite">
        {added && <p className="font-semibold">Added {capitalize(added)}</p>}
        {add.isError && (
          <p role="alert" className="font-semibold text-alert">
            The coffee type was not added. It may already be on the list.
          </p>
        )}
      </div>
    </section>
  );
}
