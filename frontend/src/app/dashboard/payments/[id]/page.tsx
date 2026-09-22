import { redirect } from "next/navigation";

export default function RedirectEditPayment() {
  redirect("/dashboard/payments");
}
