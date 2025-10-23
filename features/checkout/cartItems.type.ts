export type CartItem = {
  id: string;
  cart_id?: string;
  product_id: string;
  quantity: number;
  price: number;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
};
