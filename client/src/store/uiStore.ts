import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  theme: Theme;
  commandPaletteOpen: boolean;

  // Actions
  toggleSidebar: (isOpen?: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleCommandPalette: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  activeModal: null,
  theme: (localStorage.getItem('hc-theme-mode') as Theme) || 'dark',
  commandPaletteOpen: false,

  toggleSidebar: (isOpen) =>
    set((state) => ({
      sidebarOpen: isOpen !== undefined ? isOpen : !state.sidebarOpen,
    })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  openModal: (modalId) => set({ activeModal: modalId }),

  closeModal: () => set({ activeModal: null }),

  setTheme: (theme) => {
    localStorage.setItem('hc-theme-mode', theme);
    set({ theme });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('hc-theme-mode', newTheme);
    set({ theme: newTheme });
  },

  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
}));
