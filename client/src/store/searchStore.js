import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_HISTORY = 8;

export const useSearchStore = create(
  persist(
    (set, get) => ({
      history: [],

      addToHistory: (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        const history = get().history.filter(
          (h) => h.toLowerCase() !== trimmed.toLowerCase()
        );
        set({ history: [trimmed, ...history].slice(0, MAX_HISTORY) });
      },

      removeFromHistory: (term) =>
        set({ history: get().history.filter((h) => h !== term) }),

      clearHistory: () => set({ history: [] }),
    }),
    { name: "united-mart-search-history" }
  )
);
