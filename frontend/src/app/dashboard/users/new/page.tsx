import { redirect } from "next/navigation";

export default function RedirectNewUser() {
  redirect("/dashboard/users");
}
