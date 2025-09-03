// Product Service 
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { Product } from "@/features/admin/products/types";

export async function getServerCategoryOptions() {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getServerProducts(limit = 12) {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category_id, image_url, price, stock_quantity, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
