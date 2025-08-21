// Register 
// app/(auth)/signup/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  //const [email, setEmail] = useState('')
  //const [password, setPassword] = useState('')
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //setError(null)
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const userProfileData = Object.fromEntries(formData.entries());

    const { error } = await signUp(userProfileData);

    setLoading(false);

    //const { error } = await signUp(email, password)

   if (error) {
      setError(error.message);
      return
    } else {
      setSuccess(true)
    }
    setLoading(false)
    router
  }

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
            type='email'
            placeholder="Email"
            className="w-full rounded border p-2"
            required
          />
          <input
            name="password"
            type='password'
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
            name="city"
            placeholder="City"
            className="w-full rounded border p-2"
          />
           <input
            type="country"
            placeholder="Country"
            className="w-full rounded border p-2"
          />
           <input
            type="postal_code"
            placeholder="Postal Code"
            className="w-full rounded border p-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        )}
        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
