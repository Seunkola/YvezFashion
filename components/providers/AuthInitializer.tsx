'use client';

import { useQuery } from '@tanstack/react-query';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import { useAuthStore } from '@/features/stores/useAuthStores';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);

  useQuery({
    queryKey: ['auth-initializer'],
    queryFn: async () => {
      const supabase = getBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return null;

      // Query admin_users table
      const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single();

      setIsAdmin(!!admin);
      return { user, isAdmin: !!admin };
    },
    staleTime: 5 * 60 * 1000, // optional: 5 mins cache
  });

  return <>{children}</>;
}
