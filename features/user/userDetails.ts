import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function getCustomerDetails(user: string) {
  if (!user) return { customer: null, error: new Error("Not logged in") };

  const supabase = await getServerSupabaseClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("auth_user_id", user)
    .single();

  return { customer, error };
}
