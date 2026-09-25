"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";
import { LinkButton } from "@/app/components/atoms/Button";
import { useSessao } from "@/lib/auth/sessao";
import { useSolicitacoes } from "@/lib/solicitacoes/store";
import { formatarData, ROTULO_TIPO, rotuloDoStatus, TOM_STATUS } from "@/lib/solicitacoes/status";

export function ListaSolicitacoes() {
  const { hidratado } = useSessao();
  const solicitacoes = useSolicitacoes();

  if (!hidratado) return <Text tone="muted">Carregando…</Text>;

  if (solicitacoes.length === 0) {
    return (
      <div className="max-w-xl">
        <Text tone="muted">Você ainda não fez nenhuma solicitação.</Text>
        <div className="mt-6">
          <LinkButton href="/servicos">Ver serviços</LinkButton>
        </div>
      </div>
    );
  }

  return (
    <ul className="-mx-4 flex max-w-3xl flex-col">
      {solicitacoes.map((solicitacao) => (
        <li key={solicitacao.protocolo}>
          <Link
            href={`/minhas-solicitacoes/${solicitacao.protocolo}`}
            className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-surface-muted"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground">{solicitacao.servicoNome}</p>
              <p className="mt-0.5 text-sm text-foreground-muted">
                {solicitacao.tipo ? `${ROTULO_TIPO[solicitacao.tipo]} · ` : ""}{solicitacao.protocolo} · {formatarData(solicitacao.criadaEm)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Badge tone={TOM_STATUS[solicitacao.status]}>{rotuloDoStatus(solicitacao)}</Badge>
              <ChevronRight className="size-4 text-foreground-muted group-hover:text-brand" aria-hidden="true" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
