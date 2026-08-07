import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import { storage } from "../utils/storage";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthContextType,
} from "../types/auth.types";

// ─── Context ─────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Restaurar sessão a partir do localStorage no mount
  useEffect(() => {
    async function restoreSession() {
      const token = storage.getAccessToken();
      if (token) {
        try {
          const profile = await userService.getProfile();
          setUser(profile);
        } catch {
          // Token inválido ou expirado → limpar estado
          storage.clearAccessToken();
        }
      }
      setIsLoading(false);
    }

    restoreSession();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    await authService.login(data);
    const profile = await userService.getProfile();
    setUser(profile);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await authService.register(data);
    const profile = await userService.getProfile();
    setUser(profile);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
