"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Country, State } from "country-state-city";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [showStateList, setShowStateList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  //Get Countries and states
  const Countries = Country.getAllCountries();

  const filteredCountries = selectedCountry
    ? Countries.filter((c) =>
        c.name.toLowerCase().includes(selectedCountry.toLowerCase())
      )
    : [];

  const States = State.getStatesOfCountry(selectedCountryCode);

  const filteredStates = States.filter((state) =>
    state.name.toLowerCase().includes(selectedState.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const userProfileData = Object.fromEntries(formData.entries());

    const { error } = await signUp(userProfileData);

    setLoading(false);

    //const { error } = await signUp(email, password)

    if (error) {
      setError(error.message);
      return;
    } else {
      setSuccess(true);
    }
    setLoading(false);
    router;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">Create an Account</h1>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {success && (
          <p className="mb-4 text-sm text-green-600">
            Signup successful! Please check your email to confirm your account.
          </p>
        )}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="full_name"
              placeholder="Full Name"
              className="w-full rounded border p-2"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full rounded border p-2"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full rounded border p-2"
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              className="w-full rounded border p-2"
            />
            <input
              name="address"
              placeholder="Address"
              className="w-full rounded border p-2"
            />
            <input
              name="country"
              placeholder="Country"
              value={selectedCountry}
              className="w-full rounded border p-2"
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setShowCountryList(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowCountryList(false), 200);
              }}
            />
            {showCountryList && filteredCountries.length > 0 && (
              <ul className="absolute z-10 w-full max-h-48 overflow-y-auto bg-white rounded shadow">
                {filteredCountries.map((country) => (
                  <li
                    key={country.isoCode}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setSelectedCountry(country.name);
                      setSelectedCountryCode(country.isoCode);
                      setShowCountryList(false);
                    }}
                  >
                    {country.name}
                  </li>
                ))}
              </ul>
            )}
            <input
              name="city"
              placeholder="City/State"
              value={selectedState}
              className="w-full rounded border p-2"
              onChange={(e) => {
                setSelectedState(e.target.value);
                setShowStateList(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowStateList(false), 200);
              }}
            />
            {showStateList && States.length > 0 && (
              <ul className="absolute z-10 w-full max-h-48 overflow-y-auto bg-white rounded shadow">
                {filteredStates.map((state) => (
                  <li
                    key={state.name}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setSelectedState(state.name);
                      setShowStateList(false);
                    }}
                  >
                    {state.name}
                  </li>
                ))}
              </ul>
            )}
            <input
              name="postal_code"
              placeholder="Postal Code"
              className="w-full rounded border p-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
