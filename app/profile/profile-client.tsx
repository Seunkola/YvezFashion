"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Customer } from "@/features/user/customer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Country, State } from "country-state-city";

interface ProfileClientProps {
  customer: Customer | null;
  error: Error | null;
}

export default function ProfileClient({ customer, error }: ProfileClientProps) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [showStateList, setShowStateList] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);

  const { data: customerDetails, isLoading } = useQuery({
    queryKey: ["customer-details"],
    queryFn: () => {
      return customer;
    },
  });

  if (error) {
    toast.error(`Fetching User details failed: ${error.message}`);
    router.push("/");
  }

  if (isLoading) {
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-t-transparent border-b-transparent border-gold rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-gold border-b-gold border-transparent rounded-full animate-spin-slow"></div>
      </div>
    </div>;
  }

  //Get countries and States
  const Countries = Country.getAllCountries();
  const filteredCountries = country
    ? Countries.filter((c) =>
        c.name.toLowerCase().includes(country.toLowerCase())
      )
    : [];

  const States = State.getStatesOfCountry(countryCode);

  const filteredStates = States.filter((state) =>
    state.name.toLowerCase().includes(city.toLowerCase())
  );

  if (customerDetails) {
    return (
      <div className="p-4 max-w 2x1 mx-auto animate-fadeIn">
        <h1 className="text-2xl font-bold mb4">
          Welcome, {customerDetails.full_name}
        </h1>
        <h2 className="text-lg mb-4">Edit Account Details Below</h2>

        <div className="max-w">
          <h2 className="text-lg font-semibold mb-4">Customer Info</h2>

          <label className="block text-sm font-medium text-gold">
            Full Name
          </label>
          <input
            value={editing ? fullName : customerDetails.full_name || ""}
            disabled={!editing}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
          />

          <label className="block text-sm font-medium mt-2 text-gold ">
            Email
          </label>
          <input
            readOnly
            value={customerDetails.email}
            disabled={false}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
          />

          <label className="block text-sm font-medium mt-2 text-gold">
            Phone
          </label>
          <input
            value={editing ? phone : customerDetails.phone || ""}
            disabled={!editing}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
          />

          <label className="block text-sm font-medium mt-2 text-gold">
            Address
          </label>
          <input
            value={editing ? address : customerDetails.address || ""}
            disabled={!editing}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
          />

          {/* Country Input and function */}
          <label className="block text-sm font-medium mt-2 text-gold">
            Country
          </label>
          <input
            value={editing ? country : customerDetails.country || ""}
            disabled={!editing}
            onChange={(e) => {
              setCountry(e.target.value);
              setShowCountryList(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowCountryList(false), 200);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
          />

          {showCountryList && filteredCountries.length > 0 && (
            <ul className="absolute z-10 w-full max-h-48 overflow-y-auto bg-white rounded shadow">
              {filteredCountries.map((country) => (
                <li
                  key={country.isoCode}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => {
                    setCountry(country.name);
                    setCountryCode(country.isoCode);
                    setShowCountryList(false);
                  }}
                >
                  {country.name}
                </li>
              ))}
            </ul>
          )}
          {/* End of Country Input and function */}

          {/* State Input and function */}
          <label className="block text-sm font-medium mt-2 text-gold">
            City/State
          </label>
          <input
            value={editing ? city : customerDetails.city || ""}
            disabled={!editing}
            onChange={(e) => {
              setCity(e.target.value);
              setShowStateList(true);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
          />

          {showStateList && States.length > 0 && (
            <ul className="absolute z-10 w-full max-h-48 overflow-y-auto bg-white rounded shadow">
              {filteredStates.map((state) => (
                <li
                  key={state.name}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => {
                    setCity(state.name);
                    setShowStateList(false);
                  }}
                >
                  {state.name}
                </li>
              ))}
            </ul>
          )}
          {/* State Input and function */}

          <label className="block text-sm font-medium mt-2 text-gold">
            Postal code
          </label>
          <input
            value={editing ? postalCode : customerDetails.postal_code || ""}
            disabled={!editing}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
          />

          <button
            onClick={() => setEditing(!editing)}
            className="mt-4 w-full bg-gold text-black font semi-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    );
  }
}
