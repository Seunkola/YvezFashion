import { getServerSupabaseClient } from "./server";

export async function getServerSession() {
    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user){
        return null;
    }

    return data.user
}