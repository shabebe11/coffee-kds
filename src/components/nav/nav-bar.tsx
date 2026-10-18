import { requireUser } from "@/server/auth/require-user";
import { NavLinks } from "./nav-links";

export async function NavBar() {
  await requireUser();
  return <NavLinks />;
}
