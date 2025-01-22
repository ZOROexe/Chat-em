import { create } from "zustand";

export const useTheme = create((set) => ({
  theme: localStorage.getItem("theme" || "light"),
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme: theme });
  },
}));
