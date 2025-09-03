'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, fetchProducts, updateProduct, deleteProduct, fetchProductsWithFiletering } from "./api";
import { fetchProductsFiltersArgs, Product, ProductsInfiniteData } from "./types";
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

export function useProductsWithFilters(filters?: Omit<fetchProductsFiltersArgs, "pageParam">) {
    return useInfiniteQuery({
        queryKey: ['products', filters],
        queryFn: ({pageParam = 0}) => fetchProductsWithFiletering({pageParam, ...filters}),
        getNextPageParam:(lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        staleTime: 1000 * 60 //1 minute
    });
}

// create product with optimistic update
export function useCreateProducts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({product, image_file}: {product: Product; image_file?: File | null}) => {
            return createProduct(product, image_file);
        },
        onMutate: async ({product}) => {
            await queryClient.cancelQueries({queryKey:['products']});

            //snapshot of previous product
            const previousProduct = queryClient.getQueryData<ProductsInfiniteData>(['products']) || [];

            const optimistic: Product = {
                ...product,
                id: 'optimistic-' + Date.now(),
                image_path: product.image_path || "",
                image_url: product.image_url || ""
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
            { id, patch, image_file }: { id: string, patch: Partial<Product>, image_file: File | null }
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
        mutationFn: ({id}: {id:string}) => deleteProduct(id),
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