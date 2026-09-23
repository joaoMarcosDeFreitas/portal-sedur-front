import type { ReactNode } from "react";
import { PortalShell } from "@/app/components/organisms/PortalShell";
import { AuthGuard } from "@/app/components/organisms/AuthGuard";

/** Área logada do cidadão: mesmo visual do portal público, protegida por sessão (simulada). */
export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <PortalShell>
      <AuthGuard>{children}</AuthGuard>
    </PortalShell>
  );
}
