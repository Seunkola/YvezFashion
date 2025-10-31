"use client";

import AddressForm from "@/components/ui/AddressForm";
import { useCartItems } from "@/features/cart/hooks";
import { Customer } from "@/features/user/customer";
import { useState } from "react";
import toast from "react-hot-toast";

interface CheckoutClientProps {
  UserID: string;
  User: Customer;
}

export default function CheckoutClient({ UserID, User }: CheckoutClientProps) {
  //get items in cart from db
  const { data: cartItemsData, isLoading } = useCartItems({ id: UserID });

  //handle steps in checkout process
  const [step, setStep] = useState<
    "address" | "delivery" | "payment" | "review"
  >("address");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!cartItemsData || cartItemsData.pages[0].cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Progress */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-800">Checkout</h1>
          <div className="hidden md:flex items-center space-x-3 text-sm">
            <span className={step === "address" ? "text-gold font-medium" : ""}>
              Address
            </span>
            <span>›</span>
            <span
              className={step === "delivery" ? "text-gold font-medium" : ""}
            >
              Delivery
            </span>
            <span>›</span>
            <span className={step === "payment" ? "text-gold font-medium" : ""}>
              Payment
            </span>
            <span>›</span>
            <span className={step === "review" ? "text-gold font-medium" : ""}>
              Review
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 lg:p-8">
        {/* Step Content */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          {step === "address" && (
            <>
              <h2 className="text-lg font-semibold mb-6">
                Add Delivery Address
              </h2>
              <AddressForm
                onNext={() => setStep("delivery")}
                fullName={User.full_name}
                Phone={User.phone || ""}
                Address={User.address || ""}
                City={User.city || ""}
                Country={User.country || ""}
                PostalCode={User.postal_code || ""}
              />
            </>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit"></div>
      </main>
    </div>
  );
}
