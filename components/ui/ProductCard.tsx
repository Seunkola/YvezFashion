"use client";

import { Product } from "@/features/admin/products/types";
import { useCartStore } from "@/features/cart/store";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Minus, Plus } from "lucide-react";

type props = {
  product: Product;
};

export default function ProductCard({ product }: props) {
  const cartItem = useCartStore((store) =>
    store.items.find((item) => item.id === product.id)
  );
  const addToCart = useCartStore((store) => store.add);
  const setCartItemQty = useCartStore((store) => store.setQty);
  const removeCartItem = useCartStore((store) => store.remove);
  const inStock = (product.stock_quantity ?? 0) > 0;
  console.log(product.stock_quantity);

  return (
    <div className="border rounded-md shadow-sm hover:shadow-md transition overflow-hidden bg-white">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-gray-100">
          {/* Placeholder Image */}
          <img
            src={product.image_url}
            alt={product.description}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-black line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
            {product.description}
          </p>
          <p className="text-gold font-bold mt-2">
            ₦{Number(product.price).toLocaleString()}
          </p>
        </div>
      </Link>
      {cartItem ? (
        <div className="mt-4 w-full flex items-center justify-between px-4 py-2 border rounded-lg">
          <Button
            onClick={() =>
              cartItem.quantity > 1
                ? setCartItemQty(product.id, cartItem.quantity - 1)
                : removeCartItem(product.id)
            }
            className="px-3"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="px-4">{cartItem.quantity}</span>

          <Button
            onClick={() => setCartItemQty(product.id, cartItem.quantity + 1)}
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          className="btn btn-primary mt-4 w-full"
          disabled={!inStock}
          onClick={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image_url: product.image_url,
            });
          }}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      )}
    </div>
  );
}
