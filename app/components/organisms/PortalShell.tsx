"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/app/components/organisms/Sidebar";
import { TopBar } from "@/app/components/organisms/TopBar";
import { UtilityBar } from "@/app/components/organisms/UtilityBar";
import { Footer } from "@/app/components/organisms/Footer";

export function PortalShell({ children }: { children: ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="flex flex-1">
      <Sidebar aberta={menuAberto} aoFechar={() => setMenuAberto(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <UtilityBar />
        <TopBar aoAbrirMenu={() => setMenuAberto(true)} />
        <main id="conteudo-principal" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
