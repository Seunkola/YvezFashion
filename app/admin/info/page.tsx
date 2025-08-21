'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import { useUpdateAdminInfo } from "@/features/admin/useUpdateAdminInfo";

export default function AdminInfoPage() {

  const supabase = getBrowserSupabaseClient();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");

  //fetch Admin Info
  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin-info"],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if(!user || userError) throw new Error("Not Logged in");

      //Handle query to database to get Admin user info
      const { data, error } = await supabase
        .from("admin_users")
        .select("full_name")
        .eq("id",user.id)
        .maybeSingle();

        if (error) throw error;

        return { ...user, full_name: data?.full_name || user.user_metadata?.full_name || ""};
    },
    staleTime: 1000 * 60 * 5 //cache admin data for 5min
  });

  //update admin info
  const { mutate, isPending } =useUpdateAdminInfo(setEditing);

  //Check is admin data is loding
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
            <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Admin Info</h2>
      <label className="block text-sm font-medium mb-2 text-gold">Full Name</label>
      <input
        value = {editing ? fullName: admin?.full_name || ""}
        disabled={!editing}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
      />
      <button
        onClick={editing ? () => mutate(fullName): () => setEditing(true)}
        disabled={isPending}
        className="mt-4 w-full bg-gold text-black font semi-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
      >
        {isPending ? "Saving..." : editing ? "Save" : "Edit"}
      </button>
    </div>
  )
}