import type { ReactNode } from "react";
import { PortalShell } from "@/app/components/organisms/PortalShell";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
