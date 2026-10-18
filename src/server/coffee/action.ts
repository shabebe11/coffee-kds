"use server";

import { z } from "zod";
import { requireUser } from "../auth/require-user";
import { createCoffeeType } from "./mutation";

const CoffeeTypeSchema = z.string().trim().toLowerCase().min(1).max(40);

export async function createCoffeeTypeAction(input: string) {
    await requireUser();

    const parsed = CoffeeTypeSchema.safeParse(input);
    if (!parsed.success) throw new Error("Invalid coffee type");

    const created = await createCoffeeType(parsed.data);
    if (!created) throw new Error("Coffee type already exists");
}
