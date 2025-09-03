// components/ui/ProductCard.tsx

'use client';

import { Product } from "@/features/admin/products/types";

type props = {
  product: Product
}

export default function ProductCard ({product}: props) {
  return (
    <div className="border rounded-md shadow-sm hover:shadow-md transition overflow-hidden bg-white">
      <div className="aspect-square bg-gray-100">
        {/* Placeholder Image */}
        <img
          src={product.image_url}
          alt={product.description}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-black">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <p className="text-gold font-bold mt-2">{product.price}</p>

        <button className="btn btn-primary mt-4 w-full">Add to Cart</button>
      </div>
    </div>
  );
};
