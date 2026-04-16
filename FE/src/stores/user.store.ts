// stores/userStore.ts
import { apiClient } from "@/lib/apiClient";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  address?: string;
  bio?: string;
  createdAt?: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;

  getMyInformation: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,

  getMyInformation: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/users/me");
      set({ user: response.data });
    } catch (error) {
      console.error("Error fetching my information:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearUser: () => set({ user: null }),
}));
