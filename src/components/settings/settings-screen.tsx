import { requireUser } from "@/server/auth/require-user";
import { AddCoffeeType } from "./add-coffee-type";
import { AddUser } from "./add-user";
import { SignOut } from "./sign-out";

export async function SettingsScreen() {
  await requireUser();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <AddCoffeeType />
        <AddUser />
        <SignOut />
      </div>
    </>
  );
}
