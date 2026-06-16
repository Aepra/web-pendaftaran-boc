"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { RegistrationResponse } from "@/types";

interface RegistrationContextType {
  data: RegistrationResponse["data"] | null;
  setData: (d: RegistrationResponse["data"]) => void;
  clearData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<RegistrationResponse["data"] | null>(null);

  const setData = useCallback((d: RegistrationResponse["data"]) => {
    setDataState(d);
    if (typeof window !== "undefined") {
      localStorage.setItem("registration_data", JSON.stringify(d));
    }
  }, []);

  const clearData = useCallback(() => {
    setDataState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("registration_data");
    }
  }, []);

  return (
    <RegistrationContext.Provider value={{ data, setData, clearData }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration(): RegistrationContextType {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
}