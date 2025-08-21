import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Product, Category } from "./types";
import { data } from "framer-motion/client";

const supabase = getBrowserSupabaseClient();
const BUCKET = 'product-images';

export async function fetchProducts(): Promise<Product[]> {
    const { data , error } = await supabase
        .from('products')
        .select('name,description,category,image_url,price,stock_quantity,created_at')
        .order('created_at', { ascending: false})
    if(error) throw error;
    return data ?? [];
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
    return publicData.publicUrl;
}

export async function createProduct(input:Product,image_file?: File | null): Promise<Product> {
    let image_url: string  | null = null;
    if(image_file && image_file.size){image_url = await uploadProductImage(image_file)};

    const { data, error } = await supabase
        .from('products')
        .insert({
            name: input.name,
            description: input.description,
            price: input.price,
            stock_quantity: input.stock_quantity,
            category: input.category,
            image_url
        })
        .select('id,name,description,price,stock_quantity,category,image_url,created_at');
    if(error) throw error;
    return data![0]
}

export async function updateProduct(id:string, patch:Product, image_file?: File | null ): Promise<Product> {
    let updates = {...patch}

    if(image_file && image_file.size) {
        updates.image_url = await uploadProductImage(image_file);
    }
    
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq("id", id)
        .select('*')
        .single()
        if(error) throw error

    return data
}