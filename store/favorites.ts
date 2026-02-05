import { create } from "zustand";

interface FavoritesStore {
  coffeeIds: string[];
  toggleFavorite: (coffeeId: string) => void;
  isFavorite: (coffeeId: string) => boolean;
  getCount: () => number;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  coffeeIds: [],

  toggleFavorite: (coffeeId) => {
    set((state) => {
      const exists = state.coffeeIds.includes(coffeeId);
      return {
        coffeeIds: exists
          ? state.coffeeIds.filter((id) => id !== coffeeId)
          : [...state.coffeeIds, coffeeId],
      };
    });
  },

  isFavorite: (coffeeId) => get().coffeeIds.includes(coffeeId),

  getCount: () => get().coffeeIds.length,
}));
