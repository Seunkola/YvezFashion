'use client';

import { useEffect, useState } from 'react';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminWelcomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function verifyAndCreateAdmin() {
      const supabase = getBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You must be logged in to register as an Admin user');
        router.push('/login');
        return;
      }

      //check if user has rights to be registered as Admin
      if(user.user_metadata?.role !== 'admin'){
        toast.error('You are not authorized to be an Admin user');
        router.push('/');
        return;
      }

      // Check if already an admin
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      // Get user full name from metadata
      const fullName = user.user_metadata?.full_name || '';

      if (!existingAdmin) {
        const { error } = await supabase.from('admin_users').insert([
          {
            id: user.id,
            email: user.email,
            full_name: fullName,
          },
        ]);

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        } else {
          toast.success('Admin profile created ✅');
        }
      }

      // Redirect to admin dashboard
      router.replace('/admin');
    }

    verifyAndCreateAdmin().finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-[60vh] grid place-items-center">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-black/20 border-t-black" />
          <p>Registering Admin user...</p>
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
}
