// Login 
'use client'

import { use, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getBrowserSupabaseClient } from '@/lib/supabase/browser'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/features/stores/useAuthStores'

export default function LoginPage() {
    const supabase = getBrowserSupabaseClient();
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { data, error } = await login(email, password);
        if (error) {
            setError(error.message);
            setLoading(false);
        } 

        // check if logged in user is administrator
        const { data: adminCheck, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', data?.user.id)
        .single();

        if (adminError && adminError.code !== 'PGRST116') {
            toast.error('Error checking admin status');
            setLoading(false);
            return;
        }

        toast.success('Login successful');
        useAuthStore.getState().setIsAdmin(!!adminCheck); // set administrator to global state or not

        if (adminCheck) {
            router.replace('/admin');
        } else {
            router.replace('/profile');
        }
    }

     return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <h1 className="mb-6 text-2xl font-bold">Log In</h1>
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded border p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded border p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
                </form>
                <p className="mt-4 text-sm">
                Don’t have an account?{' '}
                <Link href="/register" className="text-blue-500 hover:underline">
                    Sign up
                </Link>
                </p>
            </div>
        </div>
  )

}