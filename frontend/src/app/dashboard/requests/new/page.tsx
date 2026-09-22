import { redirect } from "next/navigation";

export default function RedirectNewRequest() {
  redirect("/dashboard/requests");
}
