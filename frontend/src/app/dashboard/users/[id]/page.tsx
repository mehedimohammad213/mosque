import { redirect } from "next/navigation";

export default function RedirectEditUser() {
  redirect("/dashboard/users");
}
