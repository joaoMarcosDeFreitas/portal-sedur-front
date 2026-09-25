import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";
import { Breadcrumb, type MigalhaItem } from "@/app/components/molecules/Breadcrumb";
import { StatusTimeline } from "@/app/components/molecules/StatusTimeline";
import { detalheDe, tomDoRisco, type ConsultaDef, type LinhaConsulta } from "@/lib/data/consultas";

interface DetalheConsultaViewProps {
  def: ConsultaDef;
  linha: LinhaConsulta;
  /** Caminho da consulta ("/consultas/auto-de-infracao"), para o botão de voltar. */
  caminho: string;
  /** Filtros e página da lista de onde a pessoa veio, para o "voltar" reabrir o mesmo resultado. */
  busca: Record<string, string>;
  migalhas: MigalhaItem[];
}

const ROTULO = "text-xs font-semibold uppercase tracking-wide text-foreground-muted";

/**
 * Ficha de UM registro de uma consulta ou painel (aberta por "Ver detalhes" na tabela). O que
 * aparece vem da receita `detalhe` da consulta (ver `lib/data/consultas.ts`): título e selo, os
 * dados em colunas, níveis de risco, condicionantes por extenso e andamento em linha do tempo.
 */
export function DetalheConsultaView({ def, linha, caminho, busca, migalhas }: DetalheConsultaViewProps) {
  const receita = detalheDe(def);
  const selo = receita.selo?.(linha);
  const subtitulo = receita.subtitulo?.(linha);
  const resumo = receita.resumo?.(linha);
  const etapas = receita.etapas?.(linha);
  const niveis = (receita.niveis ?? []).map((id) => ({ ...colunaDe(def, id), valor: linha[id] || "—" }));
  const longas = def.colunas.filter((coluna) => coluna.longa && linha[coluna.id]);
  const titulo = receita.titulo(linha);
  const dados = [
    ...def.colunas
      // Não repete o que já está no título (ex.: a descrição) nem no selo (ex.: a situação).
      .filter((coluna) => !coluna.longa && !receita.niveis?.includes(coluna.id) && linha[coluna.id] !== titulo && linha[coluna.id] !== selo?.texto)
      .map((coluna) => ({ rotulo: coluna.rotulo, valor: linha[coluna.id] || "—" })),
    ...(receita.extras?.(linha) ?? []),
  ];

  const parametros = new URLSearchParams();
  for (const [chave, valor] of Object.entries(busca)) if (valor) parametros.set(chave, valor);
  const texto = parametros.toString();
  const voltarHref = texto ? `${caminho}?${texto}` : caminho;

  return (
    <Container className="py-12">
      <Breadcrumb itens={migalhas} />

      <Link
        href={voltarHref}
        className="toque mt-6 cursor-pointer gap-1.5 text-sm font-medium text-brand hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar aos resultados
      </Link>

      <header className="mt-6 max-w-3xl">
        <Text as="p" variant="eyebrow" tone="accent">
          {def.tituloPagina ?? def.titulo}
        </Text>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Text as="h1" variant="h1">
            {titulo}
          </Text>
          {selo && <Badge tone={selo.tom}>{selo.texto}</Badge>}
        </div>
        {subtitulo && (
          <Text tone="muted" className="mt-2">
            {subtitulo}
          </Text>
        )}
        {resumo && <Text className="mt-4">{resumo}</Text>}
      </header>

      {niveis.length > 0 && (
        <section className="mt-10 max-w-3xl">
          <Text as="h2" variant="h3">
            Classificação de risco
          </Text>
          <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {niveis.map((nivel) => (
              <div key={nivel.id}>
                <dt className={ROTULO}>{nivel.rotulo}</dt>
                <dd className="mt-1.5">
                  <Badge tone={tomDoRisco(nivel.valor)}>{nivel.valor}</Badge>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {dados.length > 0 && (
        <section className="mt-10 max-w-3xl">
          <Text as="h2" variant="h3">
            Dados do registro
          </Text>
          <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {dados.map((campo) => (
              <div key={campo.rotulo}>
                <dt className={ROTULO}>{campo.rotulo}</dt>
                <dd className="mt-1 text-foreground">{campo.valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {longas.map((coluna) => (
        <section key={coluna.id} className="mt-10 max-w-3xl">
          <Text as="h2" variant="h3">
            {coluna.rotulo}
          </Text>
          <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-foreground-muted">
            {itensDoTexto(linha[coluna.id]).map((item, indice) => (
              <li key={indice}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      {etapas && (
        <section className="mt-10 max-w-3xl">
          <Text as="h2" variant="h3">
            Andamento
          </Text>
          <div className="mt-5">
            <StatusTimeline etapas={etapas} />
          </div>
        </section>
      )}

      <p className="mt-12 flex max-w-3xl items-center gap-2 text-xs text-foreground-muted">
        <Info className="size-4 shrink-0" aria-hidden="true" />
        {def.dados === "real"
          ? "Dados oficiais da SEDUR, conforme o Portal de Serviços atual (levantamento de setembro de 2026)."
          : "Demonstração: os dados desta ficha são fictícios e servem para mostrar como a consulta funcionará."}
      </p>
    </Container>
  );
}

function colunaDe(def: ConsultaDef, id: string) {
  const coluna = def.colunas.find((c) => c.id === id);
  return { id, rotulo: coluna?.rotulo ?? id };
}

/** Texto com uma condição por linha ("-Desde que...") vira uma lista, sem os hifens do começo. */
function itensDoTexto(texto: string): string[] {
  return texto
    .split("\n")
    .map((linha) => linha.replace(/^[-–\s]+/, "").trim())
    .filter(Boolean);
}
