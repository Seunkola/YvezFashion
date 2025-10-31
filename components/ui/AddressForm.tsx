"use client";

import { useUpdateCustomerInfo } from "@/features/user/useUpdateCustomerInfo";
import { p } from "framer-motion/client";
import { set } from "nprogress";
import { useState } from "react";

interface AddressFormProps {
  onNext?: () => void;
  fullName: string;
  Phone: string;
  Address: string;
  City: string;
  Country: string;
  PostalCode: string;
}

export default function AddressForm({
  onNext,
  fullName,
  Phone,
  Address,
  City,
  Country,
  PostalCode,
}: AddressFormProps) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(Phone);
  const [address, setAddress] = useState(Address);
  const [city, setCity] = useState(City);
  const [country, setCountry] = useState(Country);
  const [postalCode, setPostalCode] = useState(PostalCode);

  const { mutate, isPending } = useUpdateCustomerInfo(setEditing);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext?.();
  };
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 text-sm font-medium">Full Name</label>
        <input
          name="fullName"
          value={fullName}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Phone Number</label>
        <input
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            mutate({ phone: e.target.value });
          }}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Country</label>
          <input
            name="country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              mutate({ country: e.target.value });
            }}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">State / City</label>
          <input
            name="city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              mutate({ city: e.target.value });
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Street Address</label>
        <input
          name="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            mutate({ address: e.target.value });
          }}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Postal Code</label>
        <input
          name="postalCode"
          value={postalCode}
          onChange={(e) => {
            setPostalCode(e.target.value);
            mutate({ postal_code: e.target.value });
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gold hover:bg-orange-600 text-white font-medium py-2 rounded-lg"
      >
        {isPending ? "Saving..." : "Save & Continue"}
      </button>
    </form>
  );
}
