"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { syncGoogleUser } from "@/lib/api/boc-api";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  // Sync user to Apps Script sheet when Google login succeeds
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      syncGoogleUser({
        name: session.user.name || "",
        email: session.user.email,
      });
    }
  }, [status, session?.user?.email, session?.user?.name]);

  const user: MockUser | null = session?.user
    ? {
        id: (session.user as any).id || session.user.email || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        institution: "",
      }
    : null;

  const login = () => {
    signIn("google", { redirectTo: "/register" });
  };

  const logout = () => {
    signOut({ redirectTo: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: status === "authenticated",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}