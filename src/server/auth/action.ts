"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { verifyPassword } from "./password";
import { createSession, deleteSession } from "./session";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Username and password are required" };

  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid) return { error: "Invalid username or password" };

  await createSession({ userId: user.userId, username: user.username });
  redirect("/order");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
