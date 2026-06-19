"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { RegistrationData } from "@/types";

interface RegistrationContextType {
  data: RegistrationData | null;
  paymentFlowStage: "REGISTERED" | "SKIPPED_PAYMENT" | null;
  setData: (d: RegistrationData) => void;
  clearData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<RegistrationData | null>(null);

  const setData = useCallback((d: RegistrationData) => {
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

  const paymentFlowStage = data?.payment_flow_stage ?? null;

  return (
    <RegistrationContext.Provider value={{ data, paymentFlowStage, setData, clearData }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration(): RegistrationContextType {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
}