"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import toast from "react-hot-toast";

interface CustomerUpdate {
  full_name?: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  postal_code?: string;
}

export function useUpdateCustomerInfo(setEditing: (v: boolean) => void) {
  const supabase = getBrowserSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerDetails: CustomerUpdate) => {
      //Check if user is logged in
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!user || error) throw new Error("Not Logged in");

      //Remove undefined values
      const updatedCustomerDetails = Object.fromEntries(
        Object.entries(customerDetails).filter(
          ([_, v]) => v !== undefined && v !== ""
        )
      ) as Partial<CustomerUpdate>;

      if (Object.keys(updatedCustomerDetails).length === 0)
        throw new Error("No fields to update");

      //Update Customer info
      const { data: newCustomerDetails, error: updateError } = await supabase
        .from("customers")
        .update(updatedCustomerDetails)
        .eq("auth_user_id", user.id);

      if (updateError) throw updateError;

      return newCustomerDetails;
    },
    onMutate: async (newCustomerDetails) => {
      await queryClient.cancelQueries({ queryKey: ["customer-details"] });
      const prevData = queryClient.getQueryData(["customer-details"]);

      queryClient.setQueryData(["customer-details"], (old: any) => ({
        ...old,
        ...newCustomerDetails,
      }));

      return { prevData };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["customer-details"], context?.prevData);
      toast.error("Error updating Customer details: " + error);
    },
    onSuccess: () => {
      //toast.success("Profile updated");
      setEditing(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-details"] });
    },
  });
}
