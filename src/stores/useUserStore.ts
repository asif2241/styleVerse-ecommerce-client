/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/user.store.ts
import { getUserInfo } from "@/services/auth/getUserInfo";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
    user: any | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            error: null,

            clearUser: () => set({ user: null, error: null }),

            fetchUser: async () => {
                if (get().isLoading) return;

                set({ isLoading: true, error: null });

                try {
                    const result = await getUserInfo();

                    if (result.success && result.user) {
                        set({
                            user: result.user,
                            isLoading: false
                        });
                    } else {
                        set({
                            user: null,
                            error: result.message || "Failed to fetch user",
                            isLoading: false
                        });
                    }
                } catch (error: any) {
                    set({
                        user: null,
                        error: error.message || "Network error",
                        isLoading: false,
                    });
                }
            },
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
            onRehydrateStorage: () => (state) => {
                // After hydration, fetch fresh data if user exists
                if (state?.user) {
                    setTimeout(() => {
                        state.fetchUser();
                    }, 1000);
                }
            },
        }
    )
);