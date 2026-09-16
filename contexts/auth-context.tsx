"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { getAdmins, syncGoogleUser } from "@/lib/api/boc-api";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string;
  institution: string;
}

interface AuthContextType {
  user: MockUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  roleStatus: "loading" | "ready" | "error";
  role: "admin" | "participant" | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  retryRoleCheck: () => void;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [roleState, setRoleState] = useState<{
    email: string;
    status: "loading" | "ready" | "error";
    role: "admin" | "participant" | null;
  } | null>(null);
  const [roleCheckKey, setRoleCheckKey] = useState(0);

  // Sync user to Apps Script sheet when Google login succeeds
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      syncGoogleUser({
        name: session.user.name || "",
        email: session.user.email,
      });
    }
  }, [status, session?.user?.email, session?.user?.name]);

  useEffect(() => {
    const rawEmail = session?.user?.email;
    if (status !== "authenticated" || !rawEmail) {
      return;
    }

    const email = rawEmail.trim().toLowerCase();
    let active = true;
    getAdmins()
      .then((admins) => {
        if (!active) return;
        const normalizedAdmins = admins.map((admin) => admin.trim().toLowerCase());
        setRoleState({
          email,
          status: "ready",
          role: normalizedAdmins.includes(email) ? "admin" : "participant",
        });
      })
      .catch(() => {
        if (active) setRoleState({ email, status: "error", role: null });
      });

    return () => {
      active = false;
    };
  }, [status, session?.user?.email, roleCheckKey]);

  const user: MockUser | null = session?.user
    ? {
        id: (session.user as { id?: string }).id || session.user.email || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        institution: "",
      }
    : null;

  const login = () => {
    signIn("google", { redirectTo: "/login" });
  };

  const logout = () => {
    signOut({ redirectTo: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        roleStatus:
          status === "loading" ||
          (status === "authenticated" && roleState?.email !== user?.email.trim().toLowerCase())
            ? "loading"
            : roleState?.status ?? "ready",
        role:
          roleState && user && roleState.email === user.email.trim().toLowerCase()
            ? roleState.role
            : null,
        isAuthenticated: status === "authenticated",
        isAdmin:
          Boolean(roleState && user && roleState.email === user.email.trim().toLowerCase() && roleState.role === "admin"),
        retryRoleCheck: () => {
          if (user) setRoleState({ email: user.email.trim().toLowerCase(), status: "loading", role: null });
          setRoleCheckKey((key) => key + 1);
        },
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
