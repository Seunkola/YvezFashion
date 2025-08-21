import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Product, Category } from "./types";


const supabase = getBrowserSupabaseClient();
const BUCKET = 'product-images';
const PAGE_SIZE = 10;

export async function getCategoryOptions(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchProducts({pageParam = 0}:{pageParam?: number}): 
Promise<{products: Product[]; nextPage: number | null}> {

    // fetch products with infinite scroll
    const { data , error, count } = await supabase
        .from('products')
        .select('id,name,description,image_url,price,stock_quantity,created_at,categories(id,name)',
        {count: "exact"})
        .order('created_at', { ascending: false})
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

    if(error) throw error;

    const products = data?.map((product: any)=> ({
            ...product,
            category:product.category?.name ?? null
        })) ?? [];

    // determine if more products still availale to load
    const hasMoreProducts = count && (pageParam + 1) * PAGE_SIZE < count;
    
    return {
        products,
        nextPage: hasMoreProducts ? pageParam + 1 : null
    }
}

export async function uploadProductImage(file:File) {
    const ext = file.name.split('.').pop();
    const path = `admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: 'image/*',
        cacheControl: '3600',
        upsert: false
    });
    if(error) throw error;
    const {data: publicData} = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return {
        publicUrl: publicData.publicUrl,
        path
    }
}

export async function createProduct(input:Product, image_file?: File | null): Promise<Product> {
    let image_url: string  | null = null;
    let image_path: string | null = null;

    if(image_file && image_file.size){
        const uploadImage = await uploadProductImage(image_file);
        image_url = uploadImage.publicUrl;
        image_path = uploadImage.path;
    };

    const { data, error } = await supabase
        .from('products')
        .insert({
            name: input.name,
            description: input.description,
            price: input.price,
            stock_quantity: input.stock_quantity,
            category_id: input.category_id,
            image_url,
            image_path
        })
        .select('id,name,description,price,stock_quantity,category_id,image_url,image_path,created_at')
        .single();
    if(error) throw error;
    return data
}

export async function updateProduct(id:string, patch:Partial<Product>, image_file?: File | null ): Promise<Product> {
    const updates = {...patch}

    if(image_file && image_file.size) {
        const uploadImage = await uploadProductImage(image_file);
        updates.image_url = uploadImage.publicUrl;
        updates.image_path = uploadImage.path;
    }
    
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq("id", id)
        .select('id,name,description,price,stock_quantity,category_id,image_url,image_path,created_at')
        .single();
    
    if(error) throw error

    return data
}

export async function deleteProduct(id:string) {
    //Get image path stored in the database
    const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("image_path")
        .eq("id", id)
        .single();

    if (fetchError) throw new Error(fetchError.message);

    // delete product from database based on id
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq("id", id);
    
    if(deleteError) throw new Error(deleteError.message);

    //delete image if exist in the bucket
    if(product?.image_path) {
        const { error: storageDeleteError } = await supabase.storage
            .from(BUCKET)
            .remove([product.image_path]);

        if(storageDeleteError){
            console.warn("Product deleted but failed to delete image:", storageDeleteError.message);
        }
    }
}