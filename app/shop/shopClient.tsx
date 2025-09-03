"use client";

import { useState } from "react";
import { useProductsWithFilters } from "@/features/admin/products/hooks";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import { Category } from "@/features/admin/products/types";
import ProductCard from "@/components/ui/ProductCard";
import Filters from "@/components/ui/Filters";

interface ShopClientProps {
    categories: Category[];
}

export default function ShopClient({categories} : ShopClientProps) {
    const [selectCategory, setSelectCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number,number]>([10000, 200000]);

    const deleteProduct = () => {
        return;
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isFetching,
    } = useProductsWithFilters({category: selectCategory, priceRange });

    const products = data?.pages.flatMap((page) => page.products) ?? [];

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Filter & Price Filter */}
            <Filters
                categories={categories}
                selectedCategory={selectCategory}
                onCategoryChange={setSelectCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
             />

            {/* Loading Skeleton */}
            <div className="flex-1">
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {Array.from({length: 8}).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-lg border p-4 space-y-3"
                        >
                            <div className="bg-gray-300 h-40 w-full rounded-md" />
                            <div className="h-4 bg-gray-300 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State No product Available */}
            {!isLoading && products.length === 0 && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-16"
                    >
                    <Image
                        src="images/empty-products.svg"
                        alt="No products"
                        width={200}
                        height={200}
                    />
                    <h2 className="text-xl font-semibold mt-4">No Products Found</h2>
                    <p className="text-gray-500 mt-2 max-w-sm">
                        Try adjusting your filters or check back later for new arrivals.
                    </p>
                    <Button
                        onClick={() => {
                        setSelectCategory(null);
                        setPriceRange([0, 200000]);
                        }}
                        className="mt-6 bg-gold text-black hover:opacity-90"
                    >
                        Reset Filters
                    </Button>
                </motion.div>
            )}

            {/* Products Grid */}
            {products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                </div>
            )}

            {/* Load More for paginated scroll */}
            {hasNextPage && products.length > 0 && (
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="bg-gold text-black hover:opacity-90"
                    >
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
            </div>
        </div>
    )
}