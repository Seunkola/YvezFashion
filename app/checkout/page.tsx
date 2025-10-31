import { getServerSession } from "@/lib/supabase/server-session";
import { redirect } from "next/navigation";
import CheckoutClient from "./checkoutClient";
import { getCustomerDetails } from "@/features/user/userDetails";

export default async function Checkout() {
  // get user id from browser session
  const user = await getServerSession();

  // check if user is authenticated
  if (!user) {
    redirect("/login");
  }

  // get customer details
  const { customer } = await getCustomerDetails(user.id);

  return <CheckoutClient UserID={customer.id} User={customer} />;
}
