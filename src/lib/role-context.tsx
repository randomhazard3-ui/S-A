"use client";

import { createContext, useContext, useState } from "react";

export type ViewRole =
  | "CUSTOMER_PORTFOLIO_ADMIN"
  | "SA_ENGINEER"
  | "CONTRACTOR_ADMIN"
  | "READ_ONLY_AUDITOR";

export const VIEW_ROLE_LABEL: Record<ViewRole, string> = {
  CUSTOMER_PORTFOLIO_ADMIN: "Amara Osei — Customer Portfolio Administrator",
  SA_ENGINEER: "Jordan Blake — S&A Engineer",
  CONTRACTOR_ADMIN: "Metro Plumbing Services — Contractor Admin",
  READ_ONLY_AUDITOR: "Chidi Okafor — Read-only Auditor",
};

const RoleContext = createContext<{
  role: ViewRole;
  setRole: (role: ViewRole) => void;
} | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<ViewRole>("CUSTOMER_PORTFOLIO_ADMIN");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useViewRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useViewRole must be used within a RoleProvider");
  return ctx;
}
