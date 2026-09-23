"use client";

import Link from "next/link";
import { Menu, LogIn } from "lucide-react";
import { SearchBar } from "@/app/components/molecules/SearchBar";

export function TopBar({ aoAbrirMenu }: { aoAbrirMenu: () => void }) {
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

        <Link
          href="/login"
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border-strong px-4 py-2.5 text-sm font-medium text-brand hover:bg-primary-600/10"
        >
          <LogIn className="size-4" aria-hidden="true" />
          Entrar
        </Link>
      </div>
    </div>
  );
}
