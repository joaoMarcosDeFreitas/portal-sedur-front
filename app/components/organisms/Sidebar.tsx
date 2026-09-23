"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Gavel,
  ImagePlus,
  Landmark,
  LayoutGrid,
  Newspaper,
  Scale,
  Eye,
  type LucideIcon,
} from "lucide-react";

const NAV: { rotulo: string; href: string; icone: LucideIcon }[] = [
  { rotulo: "Serviços", href: "/servicos", icone: LayoutGrid },
  { rotulo: "Legislação", href: "/legislacao", icone: Scale },
  { rotulo: "Notícias", href: "/noticias", icone: Newspaper },
  { rotulo: "Licitações", href: "/licitacoes", icone: Gavel },
  { rotulo: "Transparência", href: "/transparencia", icone: Eye },
  { rotulo: "Institucional", href: "/institucional", icone: Landmark },
  { rotulo: "Formulários", href: "/formularios", icone: FileText },
];

interface SidebarProps {
  aberta: boolean;
  aoFechar: () => void;
}

export function Sidebar({ aberta, aoFechar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {aberta && (
        <div
          className="fixed inset-0 z-30 bg-neutral-900/40 lg:hidden"
          onClick={aoFechar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col gap-8 overflow-y-auto border-r border-border bg-surface px-5 py-6 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          aberta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Espaço reservado para a logo oficial da SEDUR, quando o usuário fornecer. */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-border-strong text-foreground-muted">
            <ImagePlus className="size-5" aria-hidden="true" />
          </div>
          <Link
            href="/"
            onClick={aoFechar}
            className="mt-3 block cursor-pointer font-display text-xl font-semibold text-brand"
          >
            Portal SEDUR
          </Link>
        </div>

        <nav aria-label="Navegação principal" className="flex-1">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => {
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
