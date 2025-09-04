'use client'

import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/features/admin/products/types";
import { useCartStore } from "@/features/cart/store";
import { useFavouriteStore } from "@/features/favourites/store";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type ProductWithCategory = Product & { categories?: { id: string; name: string}[] | null}

export default function ProductClient({
    product,
    relatedProduct
}: {
    product: ProductWithCategory;
    relatedProduct: Array<Pick<Product, "id" | "name" | "image_url" | "price" | "category_id">> | null;
}
) {
    const addToCart = useCartStore((store) => store.add);
    const toggelFav = useFavouriteStore((store) => store.toggle);
    const isFav = useFavouriteStore((store) => store.ids.includes(product.id));
    const [activeImage] = useState(product.image_url);

    const inStock = (product.stock_quantity ?? 0) > 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Gallery */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5}}
                className="w-full"
            >
                <div className="aspect-square w-full bg-white border rounded-2x1 shadow-sm">
                    {activeImage ? (
                        <img
                            src={activeImage}
                            alt={product.name}
                            //sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                        />
                    ): (
                        <div className="grid place-items-center h-full text-gray-400">
                            No Image
                        </div>
                    )}

                </div>
            </motion.section>

            {/* Info */}
            <section className="flex flex-col gap-5">
                <h1 className="text-3x1 font-bold">{product.name}</h1>
                <p className="text-sm text-gary-500">
                    {product.categories?.[0]?.name ?? "Uncategorized"}
                </p>

                <div className="flex items-center gap-3">
                    <span className="text-2x1 font-semibold">
                        ₦{Number(product.price ?? 0).toLocaleString()}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                        inStock
                        ?
                        "bg-green-100 text-green-700"
                        :
                        "bg-red-100 text-red-700"
                    }`}>
                        {inStock ? "In Stock": "Out of Stock"}
                    </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                    {product.description}
                </p>

                <div className="flex gap-3 mt-4 flex-wrap">
                    <Button
                        className="bg-[var(--color-gold)] text-black flex-grow hover:opacity-90"
                        disabled={!inStock}
                        onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: Number(product.price ?? 0),
                            image_url: product.image_url ?? "",
                            quantity: 1
                        })}
                    >
                        {inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>

                    <Button
                        className={`border ${isFav ? 'border-[var(--color-gold)] text-[var(--color-gold)]' : ''} flex-grow`}
                        onClick={() => toggelFav(product.id)}
                    >
                        {isFav ?"★ Favourited" : "☆ Add to Favourites"}
                    </Button>
                </div>

                {/* Related products carousel */}
                {relatedProduct && (
                    relatedProduct.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        transition={{ delay:0.2, duration:0.5}}
                        className="md:col-span-2 mt-12"
                    >
                        <h2 className="text-2xl md:text-2xl font-extrabold tracking-tight mb-10">YOU MIGHT ALSO LIKE</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProduct.map((p) => (
                                <div key={p.id} className="min-w-[180px]">
                                    <ProductCard product={p as any} />
                                </div>
                            ))}
                        </div>
                    </motion.section>
                ))}
            </section>

        </div>
    )

}
