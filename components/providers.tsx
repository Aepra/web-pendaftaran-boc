"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { RegistrationProvider } from "@/contexts/registration-context";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RegistrationProvider>
        {children}
      </RegistrationProvider>
    </AuthProvider>
  );
}