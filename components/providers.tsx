import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/auth-context";
import { RegistrationProvider } from "@/contexts/registration-context";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <RegistrationProvider>
          {children}
        </RegistrationProvider>
      </AuthProvider>
    </SessionProvider>
  );
}