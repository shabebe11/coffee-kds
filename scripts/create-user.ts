import postgres from "postgres";
import { hashPassword } from "../src/server/auth/password.ts";

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error("Usage: pnpm user:create <username> <password>");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const passwordHash = await hashPassword(password);
await sql`insert into users (user_id, username, password_hash) values (${crypto.randomUUID()}, ${username}, ${passwordHash})`;
console.log(`Created user ${username}`);
await sql.end();
