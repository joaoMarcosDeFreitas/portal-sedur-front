"use client";

import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";
import { Button, LinkButton } from "@/app/components/atoms/Button";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { StatusTimeline, type EtapaTimeline } from "@/app/components/molecules/StatusTimeline";
import { useSessao } from "@/lib/auth/sessao";
import { concluirSolicitacao, confirmarPagamento, useSolicitacoes } from "@/lib/solicitacoes/store";
import { formatarValor } from "@/lib/solicitacoes/dam";
import { formatarData, formatarDataHora, ROTULO_STATUS, TOM_STATUS } from "@/lib/solicitacoes/status";
import type { Solicitacao } from "@/types/solicitacao";

function montarEtapas(s: Solicitacao): EtapaTimeline[] {
  const etapas: EtapaTimeline[] = [
    { titulo: "Solicitação protocolada", detalhe: formatarDataHora(s.criadaEm), estado: "feito" },
  ];
  if (s.dam) {
    etapas.push({
      titulo: "Pagamento do DAM",
      detalhe: s.dam.pagoEm
        ? `Confirmado em ${formatarDataHora(s.dam.pagoEm)}`
        : `Vence em ${formatarData(s.dam.vencimento)}`,
      estado: s.dam.pagoEm ? "feito" : "atual",
    });
  }
  etapas.push({
    titulo: "Análise técnica",
    estado: s.status === "em_analise" ? "atual" : s.status === "concluida" ? "feito" : "pendente",
  });
  etapas.push({
    titulo: "Conclusão",
    detalhe: s.status === "concluida" ? "Documento disponível" : undefined,
    estado: s.status === "concluida" ? "feito" : "pendente",
  });
  return etapas;
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-foreground-muted">{rotulo}</dt>
      <dd className="mt-0.5 text-foreground">{valor}</dd>
    </div>
  );
}

export function DetalheSolicitacao({ protocolo }: { protocolo: string }) {
  const { hidratado } = useSessao();
  const solicitacao = useSolicitacoes().find((s) => s.protocolo === protocolo);

  if (!hidratado) return <Text tone="muted">Carregando…</Text>;

  if (!solicitacao) {
    return (
      <div className="max-w-xl">
        <Text as="h1" variant="h1">
          Solicitação não encontrada
        </Text>
        <Text tone="muted" className="mt-3">
          Não encontramos o protocolo {protocolo} neste navegador.
        </Text>
        <div className="mt-6">
          <LinkButton href="/minhas-solicitacoes">Ver minhas solicitações</LinkButton>
        </div>
      </div>
    );
  }

  const { dam } = solicitacao;

  return (
    <>
      <Breadcrumb
        itens={[{ rotulo: "Minhas solicitações", href: "/minhas-solicitacoes" }, { rotulo: solicitacao.protocolo }]}
      />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Text as="h1" variant="h1">
          {solicitacao.servicoNome}
        </Text>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Badge tone={TOM_STATUS[solicitacao.status]}>{ROTULO_STATUS[solicitacao.status]}</Badge>
        <Text variant="small" tone="muted">
          Protocolo {solicitacao.protocolo}
        </Text>
      </div>

      <div className="mt-10 grid max-w-4xl gap-12 lg:grid-cols-2">
        <section aria-labelledby="andamento">
          <Text as="h2" variant="h3" id="andamento">
            Andamento
          </Text>
          <div className="mt-5">
            <StatusTimeline etapas={montarEtapas(solicitacao)} />
          </div>
        </section>

        <div className="flex flex-col gap-10">
          {dam && (
            <section aria-labelledby="dam">
              <Text as="h2" variant="h3" id="dam">
                Pagamento (DAM)
              </Text>
              <Text as="p" variant="h2" className="mt-3 tabular-nums">
                {formatarValor(dam.valor)}
              </Text>
              <Text variant="small" tone="muted" className="mt-1">
                Vencimento: {formatarData(dam.vencimento)}
              </Text>
              <Text variant="small" tone="muted" className="mt-3 break-all font-mono">
                {dam.codigo}
              </Text>
              {dam.pagoEm ? (
                <div className="mt-4">
                  <Badge tone="success">Pago em {formatarDataHora(dam.pagoEm)}</Badge>
                </div>
              ) : (
                <>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button onClick={() => confirmarPagamento(solicitacao.protocolo)}>Pagar com PIX</Button>
                    <Button variant="secondary" onClick={() => confirmarPagamento(solicitacao.protocolo)}>
                      Pagar boleto
                    </Button>
                  </div>
                  <Text variant="small" tone="muted" className="mt-2">
                    Demonstração: o pagamento é simulado e confirmado na hora.
                  </Text>
                </>
              )}
            </section>
          )}

          <section aria-labelledby="dados">
            <Text as="h2" variant="h3" id="dados">
              Dados da solicitação
            </Text>
            <dl className="mt-4 flex flex-col gap-4 text-sm">
              <Dado rotulo="Requerente" valor={solicitacao.requerente} />
              <Dado rotulo="Imóvel" valor={`${solicitacao.imovel} — ${solicitacao.bairro}`} />
              {solicitacao.area ? <Dado rotulo="Área da intervenção" valor={`${solicitacao.area} m²`} /> : null}
              {solicitacao.descricao ? <Dado rotulo="Descrição" valor={solicitacao.descricao} /> : null}
              <Dado
                rotulo="Documentos anexados"
                valor={
                  solicitacao.documentosAnexados.length > 0
                    ? `${solicitacao.documentosAnexados.length} documento(s)`
                    : "Nenhum documento anexado"
                }
              />
            </dl>
          </section>

          {solicitacao.status === "em_analise" && (
            <div>
              <Button variant="ghost" size="sm" onClick={() => concluirSolicitacao(solicitacao.protocolo)}>
                Simular conclusão (demonstração)
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
