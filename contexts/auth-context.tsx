"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string;
  institution: string;
}

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: MockUser = {
  id: "google-oauth2-117003812345678900000",
  name: "Alexandra Firmansyah",
  email: "alexandra.firmansyah@gmail.com",
  image: "https://lh3.googleusercontent.com/a/ACg8ocJxHfGj4bN9kLmPqRsTuVwXyZ0ABCDEFGHijklm=s96-c",
  institution: "Universitas Indonesia",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = useCallback(() => {
    // Simulate Google OAuth popup/redirect
    setUser(MOCK_USER);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}