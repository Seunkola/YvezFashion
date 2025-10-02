"use client";

import { useCartStore } from "@/features/cart/store";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const items = useCartStore((state) => state.items);

  // total quantity (sum of all items)
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative cursor-pointer">
      {totalQty > 0 && (
        <span className="absolute -top-7 -right-2 bg-gold text-white text-xs font-bold rounded-full px-2 py-0.5">
          {totalQty}
        </span>
      )}
    </div>
  );
}
