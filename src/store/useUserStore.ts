import { create } from "zustand";
import { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
