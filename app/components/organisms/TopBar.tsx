"use client";

import Link from "next/link";
import { Menu, LogIn, LogOut, UserRound } from "lucide-react";
import { SearchBar } from "@/app/components/molecules/SearchBar";
import { useSessao } from "@/lib/auth/sessao";

const BOTAO_CONTA =
  "flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border-strong px-4 py-2.5 text-sm font-medium text-brand hover:bg-primary-600/10";

export function TopBar({ aoAbrirMenu }: { aoAbrirMenu: () => void }) {
  const { usuario, hidratado, sair } = useSessao();

  return (
    <div>
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={aoAbrirMenu}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted lg:hidden"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <div className="flex-1">
          <SearchBar />
        </div>

        {hidratado && usuario ? (
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/minhas-solicitacoes" className={BOTAO_CONTA}>
              <UserRound className="size-4" aria-hidden="true" />
              <span className="max-w-32 truncate">{usuario.nome.split(" ")[0]}</span>
            </Link>
            <button
              type="button"
              onClick={sair}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="size-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <Link href="/login" className={BOTAO_CONTA}>
            <LogIn className="size-4" aria-hidden="true" />
            Entrar
          </Link>
        )}
      </div>
    </div>
  );
}
