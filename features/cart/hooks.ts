import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCartItems } from "../checkout/api";

export function useCartItems(user: { id: string }) {
  return useInfiniteQuery({
    queryKey: ["cart-items", user.id],
    queryFn: ({ pageParam = 0 }) =>
      fetchCartItems({ pageParam: pageParam, customerId: user.id }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!user.id,
    staleTime: 1000 * 60, //1 minute
  });
}
