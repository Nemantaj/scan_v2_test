import { create } from "zustand";

export const useUIStore = create((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  isDrawerOpen: false,
  drawerConfig: null, // { title, items: [], onApply: (values) => {} }
  openDrawer: (config) => set({ isDrawerOpen: true, drawerConfig: config }),
  closeDrawer: () => set({ isDrawerOpen: false, drawerConfig: null }),
}));
