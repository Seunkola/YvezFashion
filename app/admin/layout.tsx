// Admin Dashboard 
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/supabase/server-session'
import { getServerSupabaseClient as createServerSupabase } from '@/lib/supabase/server' 
import  DashboardSidebar from './dashboard';

export default async function AdminDashboadLayout({children}: {children: React.ReactNode}) {
    const user = await getServerSession();
    if(!user) redirect ('/login');

    const supabase = await createServerSupabase();
    const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

    if(!admin) redirect('/');

    return (
         <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Content */}
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    )
}
