"use server";

import { z } from "zod";
import { requireUser } from "../auth/require-user";
import { createUser } from "./mutation";

const NewUserSchema = z.object({
    username: z.string().trim().toLowerCase().min(3).max(40),
    password: z.string().min(8).max(128),
});

export type NewUserInput = z.infer<typeof NewUserSchema>;

export async function createUserAction(input: NewUserInput) {
    await requireUser();

    const parsed = NewUserSchema.safeParse(input);
    if (!parsed.success) throw new Error("Invalid user");

    const created = await createUser(parsed.data.username, parsed.data.password);
    if (!created) throw new Error("Username already exists");
}
