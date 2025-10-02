// Cart Types
type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  totalAmount: number;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  setQty: (id: string, qty: number) => void;
};
