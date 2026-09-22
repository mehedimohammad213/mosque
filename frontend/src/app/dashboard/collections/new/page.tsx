import { redirect } from "next/navigation";

export default function RedirectNewCollection() {
  redirect("/dashboard/collections");
}
