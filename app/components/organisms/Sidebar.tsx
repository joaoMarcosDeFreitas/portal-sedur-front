"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSessao } from "@/lib/auth/sessao";
import {
  ClipboardList,
  FileText,
  Gavel,
  Landmark,
  LayoutGrid,
  Newspaper,
  Scale,
  SearchCheck,
  Eye,
  type LucideIcon,
} from "lucide-react";

const NAV: { rotulo: string; href: string; icone: LucideIcon }[] = [
  { rotulo: "Serviços", href: "/servicos", icone: LayoutGrid },
  { rotulo: "Consultas", href: "/consultas", icone: SearchCheck },
  { rotulo: "Legislação", href: "/legislacao", icone: Scale },
  { rotulo: "Notícias", href: "/noticias", icone: Newspaper },
  { rotulo: "Licitações", href: "/licitacoes", icone: Gavel },
  { rotulo: "Transparência", href: "/transparencia", icone: Eye },
  { rotulo: "Institucional", href: "/institucional", icone: Landmark },
  { rotulo: "Formulários", href: "/formularios", icone: FileText },
];

const MINHAS_SOLICITACOES = { rotulo: "Minhas solicitações", href: "/minhas-solicitacoes", icone: ClipboardList };

interface SidebarProps {
  aberta: boolean;
  aoFechar: () => void;
}

export function Sidebar({ aberta, aoFechar }: SidebarProps) {
  const pathname = usePathname();
  const { usuario, hidratado } = useSessao();
  const itens = hidratado && usuario ? [...NAV, MINHAS_SOLICITACOES] : NAV;
  const gavetaRef = useRef<HTMLElement>(null);

  // Gaveta aberta (só existe abaixo de lg): Esc fecha e o foco vai pra dentro dela.
  useEffect(() => {
    if (!aberta) return;
    // Só no próximo frame: no commit a gaveta ainda está `visibility: hidden` e não aceitaria foco.
    const quadro = requestAnimationFrame(() => gavetaRef.current?.focus());
    function aoApertarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") aoFechar();
    }
    document.addEventListener("keydown", aoApertarTecla);
    return () => {
      cancelAnimationFrame(quadro);
      document.removeEventListener("keydown", aoApertarTecla);
    };
  }, [aberta, aoFechar]);

  return (
    <>
      {aberta && (
        <div
          className="fixed inset-0 z-30 bg-neutral-900/40 lg:hidden"
          onClick={aoFechar}
          aria-hidden="true"
        />
      )}
      {/* Fechada no mobile, a gaveta fica fora da tela: `max-lg:invisible` a tira também da ordem de Tab
          e dos leitores de tela. A transição de `visibility` só existe no estado fechado (a saída espera
          a animação); ao abrir, ela some de propósito para a gaveta ficar visível já no 1º frame e poder
          receber o foco. */}
      <aside
        id="menu-lateral"
        ref={gavetaRef}
        tabIndex={-1}
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col gap-8 overflow-y-auto border-r border-border bg-surface px-5 py-6 duration-200 focus:outline-none lg:static lg:z-auto lg:translate-x-0 ${
          aberta ? "translate-x-0 transition-transform" : "-translate-x-full transition-[transform,visibility] max-lg:invisible"
        }`}
      >
        {/* Logo oficial da SEDUR: versão escura no tema claro e versão clara no tema escuro. */}
        <Link href="/" onClick={aoFechar} className="block cursor-pointer" aria-label="SEDUR — página inicial">
          <Image
            src="/logo/sedur-logo-escura.png"
            alt="SEDUR — Secretaria Municipal de Desenvolvimento Urbano"
            width={1080}
            height={130}
            sizes="216px"
            className="h-auto w-full dark:hidden"
          />
          <Image
            src="/logo/sedur-logo-clara.png"
            alt="SEDUR — Secretaria Municipal de Desenvolvimento Urbano"
            width={1080}
            height={130}
            sizes="216px"
            className="hidden h-auto w-full dark:block"
          />
        </Link>

        <nav aria-label="Navegação principal" className="flex-1">
          <ul className="flex flex-col gap-1">
            {itens.map((item) => {
              const ativo = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icone = item.icone;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={aoFechar}
                    aria-current={ativo ? "page" : undefined}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      ativo
                        ? "bg-primary-600/10 text-brand"
                        : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    }`}
                  >
                    <Icone className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    {item.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
