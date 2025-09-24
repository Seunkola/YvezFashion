// Profile Server

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase/server-session";
import ProfileClient from "./profile-client";
import { getCustomerDetails } from "@/features/user/userDetails";

export default async function ProfileContent() {
  const user = await getServerSession();

  if (!user) {
    redirect("/login");
  }

  const { customer, error } = await getCustomerDetails(user.id);

  // Send the user to the client component for rendering
  return <ProfileClient customer={customer} error={error} userID={user.id} />;
}
