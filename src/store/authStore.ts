import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  handle: string;   // 🔥 ajoute ça
  roles?: string[];
}



interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  restore: () => void;
}

const STORAGE_KEY = "arbre32_auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => {
    const payload = { user, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null });
  },
  restore: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { user: User; token: string };
        set({ user: parsed.user, token: parsed.token });
      }
    } catch {
      // ignore
    }
  },
}));
