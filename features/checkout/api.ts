import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { CartItem, Cart } from "./cartItems.type";
import { on } from "events";

const PAGE_SIZE = 10;

export async function fetchCartItems({
  pageParam = 0,
  customerId,
}: {
  pageParam?: number;
  customerId: string;
}): Promise<{ cartItems: CartItem[]; nextPage: number | null }> {
  // check if customer id is provided
  if (!customerId) {
    return { cartItems: [], nextPage: null };
  }

  const supabase = getBrowserSupabaseClient();

  // check if cart exists for the user
  const { data: cartData, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("customer_id", customerId)
    .single();

  if (cartError) {
    throw new Error(cartError.message);
  }

  if (!cartData) {
    return { cartItems: [], nextPage: null };
  }

  // fetch cart items for the cart
  const {
    data: cartItemsData,
    error: cartItemsError,
    count,
  } = await supabase
    .from("cart_items")
    .select("id, cart_id, product_id, quantity, price", { count: "exact" })
    .eq("cart_id", cartData.id)
    .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

  // check if error occurred while fetching cart items
  if (cartItemsError) {
    throw new Error(cartItemsError.message);
  }

  const cartItems = cartItemsData ?? [];
  return {
    cartItems,
    nextPage:
      count && (pageParam + 1) * PAGE_SIZE < count ? pageParam + 1 : null,
  };
}

export async function saveCartItems({
  cartItems,
  userId,
}: {
  cartItems: CartItem[];
  userId: string;
}) {
  // check if user id is provided
  if (!userId) {
    throw new Error("User ID is required to save cart items.");
  }

  const supabase = getBrowserSupabaseClient();

  // get customer id for the user
  const customer = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", userId);

  if (customer.error) {
    throw new Error(customer.error.message);
  }

  const customerId = customer.data[0].id;

  /* save or get cart for the user */
  // check if cart exists for the user
  let cartID: string;
  const { data: existingCart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("customer_id", customerId)
    .limit(1);

  if (cartError) throw new Error(cartError.message);

  if (existingCart && existingCart.length > 0) {
    cartID = existingCart[0].id;
  } else {
    // create a new cart for the user
    const { data: newCartData, error: newCartError } = await supabase
      .from("carts")
      .insert({ customer_id: customerId })
      .select("id")
      .single();

    if (newCartError) throw new Error(newCartError.message);

    cartID = newCartData.id;
  }

  //save cart items for the cart
  const { data: savedCartItems, error: saveError } = await supabase
    .from("cart_items")
    .upsert(
      cartItems.map((item) => ({
        ...item,
        cart_id: cartID,
      })),
      { onConflict: "cart_id, product_id" }
    );

  if (saveError) throw new Error(saveError.message);

  return savedCartItems;
}

export async function deleteCartItem(cartId: string) {
  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", cartId);

  if (error) {
    throw new Error(error.message);
  }
}
