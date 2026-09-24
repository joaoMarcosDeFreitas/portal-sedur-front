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
      {/* Primeiro elemento focável da página: quem usa teclado pula a sidebar e vai direto ao conteúdo. */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Sidebar aberta={menuAberto} aoFechar={() => setMenuAberto(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header>
          <UtilityBar />
          <TopBar aoAbrirMenu={() => setMenuAberto(true)} menuAberto={menuAberto} />
        </header>
        {/* tabIndex -1: permite receber o foco do link "Pular para o conteúdo" sem entrar na ordem de Tab. */}
        <main id="conteudo-principal" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
