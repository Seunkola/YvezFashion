"use client";

import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "@/features/cart/store";

export default function Cart() {
  const cartItems = useCartStore((store) => store.items);
  const totalItems = cartItems.length;
  const totalAmount = useCartStore((store) => store.totalAmount);
  const { setQty, remove, clear } = useCartStore();

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-600 mb-4"> Your cart is Empty</p>
        <Button asChild>
          <a href="/shop">Continue Shop</a>
        </Button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
      {/* Left Section - Cart Items */}
      <section className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Cart ({totalItems} items)</h1>

        {/* Show list of items in cart */}
        {cartItems.map((cartItem) => (
          <div
            key={cartItem.id}
            className="sm:w-auto block sm:flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border"
          >
            <img
              src={cartItem.image_url}
              alt={cartItem.name}
              className="w-20 h-20 object-cover rounded"
            />

            {/* Quantity button controllers */}
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800">{cartItem.name}</h2>
              <p className="text-sm text-gray-500">
                ₦{cartItem.price.toLocaleString()}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Button
                  onClick={() =>
                    cartItem.quantity > 1
                      ? setQty(cartItem.id, cartItem.quantity - 1)
                      : remove(cartItem.id)
                  }
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-3 font-medium">{cartItem.quantity}</span>
                <Button
                  onClick={() => setQty(cartItem.id, cartItem.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Cart Item total price*/}
            <div className="w-full sm:w-auto block sm:flex sm:flex-col sm:items-end mt-3 sm:mt-0 order-2 sm:order-none">
              <p className="font-semibold text-gray-900">
                ₦{(cartItem.price * cartItem.quantity).toLocaleString()}
              </p>
              <Button
                className="text-red-500 mt-2"
                onClick={() => remove(cartItem.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </section>

      {/* Right Section - Summary */}
      <aside className="bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-20">
        <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>
        {/* Show subtotal*/}
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₦{totalAmount.toLocaleString()}</span>
        </div>

        {/* Show total amount*/}
        <div className="flex justify-between mb-4 text-sm text-gray-600">
          <span>Delivery</span>
          <span>₦0</span>
        </div>

        <div className="flex justify-between font-semibold text-gray-900 text-lg mb-6">
          <span>Total</span>
          <span>₦{totalAmount.toLocaleString()}</span>
        </div>

        {/* Check out buttons */}
        <Button className="w-full bg-[var(--color-gold)] text-black hover:opacity-90">
          Proceed to Checkout
        </Button>

        <Button className="w-full mt-3" onClick={clear}>
          Clear Cart
        </Button>
      </aside>
    </div>
  );
}
