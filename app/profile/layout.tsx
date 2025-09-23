import DashboardSidebar from "./dashboard";
import { getServerSession } from "@/lib/supabase/server-session";
import { redirect } from "next/navigation";
import { getCustomerDetails } from "@/features/user/userDetails";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();

  if (!user) {
    redirect("/login");
  }

  const { customer, error } = await getCustomerDetails(user.id);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
