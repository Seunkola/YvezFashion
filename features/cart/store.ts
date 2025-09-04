import { create } from "zustand";

export const useCartStore = create<CartState>((set) => ({
    items: [],
    add: (item) =>
        set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if(existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id ? {...i, quantity: i.quantity + item.quantity} : i
                    ),
                };
            }
            return { items: [item, ...state.items] };
        }),
    remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id)})),
    clear: () => set({ items: []}),
    setQty: (id, qty) =>
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? {...i, quantity: qty} : i))
        }))
}))