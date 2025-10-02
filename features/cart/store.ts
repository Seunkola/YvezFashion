import { create } from "zustand";

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  add: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        const existingItem = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );

        return {
          items: existingItem,
          totalAmount: state.totalAmount + item.price * item.quantity,
        };
      }

      return {
        items: [item, ...state.items],
        totalAmount: state.totalAmount + item.price,
      };
    }),
  remove: (id) =>
    set((state) => {
      const itemToRemove = state.items.find((item) => item.id === id);
      if (!itemToRemove) return state;

      return {
        items: state.items.filter((item) => item.id !== id),
        totalAmount:
          state.totalAmount - itemToRemove.price * itemToRemove.quantity,
      };
    }),
  clear: () => set({ items: [], totalAmount: 0 }),
  setQty: (id, qty) =>
    set((state) => {
      const item = state.items.find((item) => item.id === id);
      if (!item) return state;

      const quantityChange = qty - item.quantity;
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: qty } : i
      );
      return {
        items: updatedItems,
        totalAmount: state.totalAmount + quantityChange * item.price,
      };
    }),
}));
