"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrderMutation } from "@/hooks/order/query-options";
import { MILKS, OTHER } from "./options";

type Cup = {
  id: string;
  name: string;
  isCustom: boolean;
  milk: string;
  extras: string[];
  notes: string;
};

const choiceBase =
  "flex min-h-14 cursor-pointer items-center rounded-md border-2 px-4 text-lg font-semibold capitalize transition-colors " +
  "border-edge bg-surface text-fg hover:border-fg peer-checked:border-fg peer-checked:bg-fg/15 peer-checked:shadow-[inset_0_0_0_2px_var(--fg)] " +
  "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg";

function Choice({
  type,
  name,
  value,
  checked,
  onChange,
  children,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className={choiceBase}>{children}</span>
    </label>
  );
}

export function OrderForm({ coffeeTypes }: { coffeeTypes: string[] }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [cups, setCups] = useState<Cup[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [otherName, setOtherName] = useState("");
  const [milk, setMilk] = useState("whole");
  const [extras, setExtras] = useState<string[]>([]);
  const [extraInput, setExtraInput] = useState("");
  const [notes, setNotes] = useState("");
  const [placedFor, setPlacedFor] = useState<string | null>(null);

  const order = useMutation({
    ...createOrderMutation(),
    onSuccess: (_data, vars) => {
      setPlacedFor(vars.name);
      setCups([]);
      setCustomerName("");
      if (vars.coffees.some((c) => c.isCustom)) router.refresh();
    },
  });

  const isOther = selected === OTHER;
  const draftName = isOther ? otherName.trim() : (selected ?? "");
  const canAdd = draftName.length > 0;
  const canPlace = cups.length > 0 && customerName.trim().length > 0 && !order.isPending;

  function addCup() {
    if (!canAdd) return;
    const pending = extraInput.trim();
    const cupExtras = pending && !extras.includes(pending) ? [...extras, pending] : extras;
    setCups((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: draftName, isCustom: isOther, milk, extras: cupExtras, notes },
    ]);
    setSelected(null);
    setOtherName("");
    setMilk("whole");
    setExtras([]);
    setExtraInput("");
    setNotes("");
    setPlacedFor(null);
  }

  function addExtra() {
    const value = extraInput.trim();
    if (!value || extras.length >= 10) return;
    setExtras((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setExtraInput("");
  }

  function placeOrder() {
    if (!canPlace) return;
    order.mutate({
      name: customerName.trim(),
      coffees: cups.map((cup) => ({
        name: cup.name,
        isCustom: cup.isCustom,
        milk: cup.milk,
        extras: cup.extras,
        notes: cup.notes.trim() || undefined,
      })),
    });
  }

  return (
    <div className="grid flex-1 items-start gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="flex flex-col gap-8">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-xl font-bold">Coffee</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {coffeeTypes.map((type) => (
              <Choice
                key={type}
                type="radio"
                name="coffee"
                value={type}
                checked={selected === type}
                onChange={() => setSelected(type)}
              >
                {type}
              </Choice>
            ))}
            <Choice
              type="radio"
              name="coffee"
              value={OTHER}
              checked={isOther}
              onChange={() => setSelected(OTHER)}
            >
              Other
            </Choice>
          </div>
          {isOther && (
            <div className="flex flex-col gap-2">
              <label htmlFor="other-name" className="font-semibold">
                Coffee name
              </label>
              <input
                id="other-name"
                autoFocus
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                maxLength={40}
                autoComplete="off"
                className="min-h-14 rounded-md border-2 border-edge bg-surface px-4 text-lg text-fg focus:border-fg"
              />
              <p className="text-sm text-subtle">Saved to the coffee list when you place the order.</p>
            </div>
          )}
        </fieldset>

        <fieldset className="border-t border-edge pt-6">
          <legend className="mb-3 text-xl font-bold">Milk</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {MILKS.map((m) => (
              <Choice
                key={m.value}
                type="radio"
                name="milk"
                value={m.value}
                checked={milk === m.value}
                onChange={() => setMilk(m.value)}
              >
                {m.label}
              </Choice>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-edge pt-6">
          <label htmlFor="extra" className="text-xl font-bold">
            Extras
          </label>
          <div className="flex gap-3">
            <input
              id="extra"
              value={extraInput}
              onChange={(e) => setExtraInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addExtra();
                }
              }}
              maxLength={40}
              autoComplete="off"
              className="min-h-14 min-w-0 flex-1 rounded-md border-2 border-edge bg-surface px-4 text-lg text-fg focus:border-fg"
            />
            <button
              type="button"
              onClick={addExtra}
              disabled={!extraInput.trim() || extras.length >= 10}
              className="min-h-14 rounded-md border-2 border-fg px-5 text-lg font-bold text-fg disabled:cursor-not-allowed disabled:border-edge disabled:text-subtle"
            >
              Add extra
            </button>
          </div>
          {extras.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {extras.map((extra) => (
                <li key={extra}>
                  <button
                    type="button"
                    onClick={() => setExtras((prev) => prev.filter((e) => e !== extra))}
                    aria-label={`Remove extra ${extra}`}
                    className="rounded-md border-2 border-fg bg-fg/15 px-3 py-2 font-semibold text-fg"
                  >
                    {extra} &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-edge pt-6">
          <label htmlFor="notes" className="text-xl font-bold">
            Notes
          </label>
          <input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={200}
            autoComplete="off"
            className="min-h-14 rounded-md border-2 border-edge bg-surface px-4 text-lg text-fg focus:border-fg"
          />
        </div>

        <button
          type="button"
          onClick={addCup}
          disabled={!canAdd}
          className="min-h-16 rounded-md border-2 border-fg bg-fg/10 px-6 text-xl font-bold text-fg hover:bg-fg/20 disabled:cursor-not-allowed disabled:border-edge disabled:bg-transparent disabled:text-subtle"
        >
          Add to order
        </button>
      </div>

      <aside className="lg:sticky lg:top-6">
        <div className="ticket flex flex-col gap-5 p-6 pb-8">
          <div className="flex items-baseline justify-between border-b border-dashed border-rule pb-4">
            <h2 className="text-2xl font-bold">Order</h2>
            <span className="text-subtle">
              {cups.length} {cups.length === 1 ? "coffee" : "coffees"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="customer" className="font-semibold">
              Customer name
            </label>
            <input
              id="customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              maxLength={60}
              autoComplete="off"
              className="min-h-12 rounded-md border-2 border-edge bg-page px-4 text-lg text-fg focus:border-fg"
            />
          </div>

          {cups.length === 0 ? (
            <p className="py-4 text-subtle">No coffees yet. Pick a coffee and choose Add to order.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-dashed divide-rule">
              {cups.map((cup) => (
                <li key={cup.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold capitalize">{cup.name}</span>
                    <span className="text-subtle">
                      {[MILKS.find((m) => m.value === cup.milk)?.label ?? cup.milk, ...cup.extras].join(", ")}
                    </span>
                    {cup.notes.trim() && <span className="text-subtle">{cup.notes.trim()}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCups((prev) => prev.filter((c) => c.id !== cup.id))}
                    aria-label={`Remove ${cup.name}`}
                    className="rounded-md px-2 py-1 font-semibold text-alert hover:bg-fg/10"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={placeOrder}
            disabled={!canPlace}
            className="min-h-16 rounded-md border-2 border-fg bg-fg/10 px-6 text-xl font-bold text-fg hover:bg-fg/20 disabled:cursor-not-allowed disabled:border-edge disabled:bg-transparent disabled:text-subtle"
          >
            {order.isPending ? "Placing order..." : "Place order"}
          </button>

          <div aria-live="polite">
            {placedFor && <p className="font-semibold">Order placed for {placedFor}</p>}
            {order.isError && (
              <p role="alert" className="font-semibold text-alert">
                The order did not save. Check the connection and place it again.
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
