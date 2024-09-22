import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

const useAuthStore = create<AuthState>(
  (persist as AuthPersist)(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token: string) => set({ token, isAuthenticated: true }),
      clearToken: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: "auth",
    }
  )
);

export default useAuthStore;
