import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

export async function getCustomer(userID: string) {
  if (!userID) return { customer: null, error: new Error("Not logged in") };

  const supabase = await getBrowserSupabaseClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("auth_user_id", userID)
    .single();

  return { customer, error };
}

export async function getCustomerDetails(userID: string) {
  if (!userID) return { customer: null, error: new Error("Not logged in") };

  const supabase = await getBrowserSupabaseClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("auth_user_id", userID)
    .single();

  if (error) throw error;

  return { customer };
}
