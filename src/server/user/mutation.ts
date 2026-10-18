import { db } from "../db/client";
import { users } from "../db/schema";
import { hashPassword } from "../auth/password";

export async function createUser(username: string, password: string) {
    const passwordHash = await hashPassword(password);
    const inserted = await db
        .insert(users)
        .values({ username, passwordHash })
        .onConflictDoNothing({ target: users.username })
        .returning({ userId: users.userId });
    return inserted.length > 0;
}
