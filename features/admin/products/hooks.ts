'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, fetchProducts, updateProduct, deleteProduct } from "./api";
import { Product, ProductsInfiniteData } from "./types";
import toast from "react-hot-toast";

//fetch products from api using infinite scroll fetch
export function useProducts(){
    return useInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({pageParam = 0}) => fetchProducts({pageParam}),
        getNextPageParam:(lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        staleTime: 1000 * 60 //1 minute
    });
}

// create product with optimistic update
export function useCreateProducts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onMutate: async (payload) => {
            await queryClient.cancelQueries({queryKey:['products']});

            //snapshot of previous product
            const previousProduct = queryClient.getQueryData<Product[]>(['products']) || [];

            const optimistic: Product = {
                id: 'optimistic-' + Date.now(),
                name: payload.name,
                description: payload.description,
                price: payload.price,
                stock_quantity: payload.stock_quantity,
                category_id: payload.category_id,
                image_path: payload.image_path || "",
                image_url: payload.image_url || ""
            }

            // update cache optimistically
            queryClient.setQueryData<ProductsInfiniteData>(['products'], (old) => {
                if(!old) {
                    return { 
                        pages: [{products: [optimistic], nextPage: null}], pageParams: [0]
                    };
                }
                return {
                    ...old,
                    pages: old.pages.map((page, index) =>
                        index === 0
                        ?
                        {...page, products:[optimistic, ...page.products]}
                        :
                        page
                    )
                }
            })
            return { previousProduct }
        },
        onError: (error,_variables,context) => {
            toast.error('failed to create product:'+ (error as Error).message);
            if(context?.previousProduct) queryClient.setQueryData(['products'], context.previousProduct);
        },
        onSuccess: () => {
            toast.success('Product created ✅');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey:['products'] });
        }
    });
}


//update Product
export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (
            { id, patch, image_file }: { id: string, patch: Product, image_file: File | null }
        ) => updateProduct(id,patch,image_file),
        onSuccess: () => {
            toast.success('✅ Product updated');
            queryClient.invalidateQueries({ queryKey:['products']});
        },
        onError: () => {
            toast.error('update failed');
        }
    });
}

//Delete product 
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onError:(error, variables, context) => {
            toast.error("❌ Delete failed");
        },
        onSuccess: () => {
            toast.success("🗑️ Product deleted");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}