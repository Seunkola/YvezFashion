"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import toast from "react-hot-toast";

export function useUpdateAdminInfo(setEditing: (v: boolean) => void) {
    const supabase = getBrowserSupabaseClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newName: string) => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) throw new Error ("Not Logged in");

            //Update admin_users
            const { error: dbError } = await supabase
                .from("admin_users")
                .update({full_name : newName})
                .eq("id", user.id)
            
            if(dbError) throw dbError;
            
            // 2. Update Supabase Auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: newName },
            });
            if (authError) throw authError;

            return newName;
        },
        onMutate: async (newName) => {
            await queryClient.cancelQueries({ queryKey: ["admin-info"]});
            const prevData = queryClient.getQueryData(["admin-info"]);

            queryClient.setQueryData(["admin-info"], (old: any) => ({
                ...old,
                full_name: newName,
            }));
            return {prevData}
        },
         onError: (err, _, ctx) => {
            queryClient.setQueryData(["admin-info"], ctx?.prevData);
            toast.error("Failed to update name:"+err);
        },
        onSuccess: () => {
            toast.success("Profile updated ✅");
            setEditing(false);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-info"]});
        }
    });
}