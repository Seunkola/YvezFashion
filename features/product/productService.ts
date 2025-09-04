// Product Service 
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { Product } from "@/features/admin/products/types";

export async function getServerCategoryOptions() {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getServerProducts(limit = 12) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category_id, image_url, price, stock_quantity, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getServerProductByID(productID: string) {
  const supabase = await getServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, description, category_id, image_url, price, stock_quantity, created_at")
    .eq("id", productID)
    .maybeSingle();

  return data;
}

export async function getServerProductByIDWithCategory(productID: string) {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, description, category_id, image_url, price, stock_quantity, created_at,
      categories:category_id(id,name)
    `)
    .eq("id", productID)
    .single();

  const result = {data, error}

  return result;
}

export async function getServerRelatedProducts(product: Product) {
  const supabase = await getServerSupabaseClient();
  const {data} = await supabase
    .from("products")
    .select("id, name, image_url, price, category_id")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .order("created_at", { ascending: false})
    .limit(4);
  
  return {data: data ?? []};
}