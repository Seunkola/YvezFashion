import { create } from "zustand";

export const useFavouriteStore = create<FavState>((set) => ({
    ids: [],
    toggle: (id) =>
            set((state) =>
                state.ids.includes(id)
                ?
                { ids: state.ids.filter((x) => x !== id)}
                :
                {ids: [id, ...state.ids]}
            )
}))