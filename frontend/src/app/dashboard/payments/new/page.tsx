import { redirect } from "next/navigation";

export default function RedirectNewPayment() {
  redirect("/dashboard/payments");
}
