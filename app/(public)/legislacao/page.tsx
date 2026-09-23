import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Button } from "@/app/components/atoms/Button";
import { LegislacaoIcon } from "@/app/components/atoms/LegislacaoIcon";
import { IconTile } from "@/app/components/molecules/IconTile";
import { LegislacaoExplorer } from "@/app/components/organisms/LegislacaoExplorer";
import { buscarLegislacao, getResumoSecoes } from "@/lib/data/legislacao";

export const metadata: Metadata = {
  title: "Legislação",
  description: "Leis, decretos, portarias e demais normas do desenvolvimento urbano de Salvador, com busca.",
};

const um = (valor: string | string[] | undefined) => (Array.isArray(valor) ? valor[0] : valor) ?? "";

/**
 * Sem busca: ícones de cada tipo de norma (quem se divide em subtipos abre outra tela de ícones).
 * Com `?q=`: resultado da busca em toda a legislação.
 */
export default async function LegislacaoPage(props: PageProps<"/legislacao">) {
  const params = await props.searchParams;
  const q = um(params.q).trim();
  const secaoAntiga = um(params.secao);

  const secoes = await getResumoSecoes();

  // Links antigos (?secao=leis) levam para a tela do tipo.
  if (!q && secoes.some((s) => s.id === secaoAntiga)) redirect(`/legislacao/${secaoAntiga}`);

  if (q) {
    const inicial = await buscarLegislacao({ q });
    return (
      <Container className="py-12">
        <Text as="h1" variant="h1">
          Legislação
        </Text>
        <Text tone="muted" className="mt-3">
          Resultado da busca em todas as normas.{" "}
          <Link href="/legislacao" className="cursor-pointer font-medium text-brand hover:underline">
            Voltar aos tipos de norma
          </Link>
        </Text>
        <div className="mt-8">
          <LegislacaoExplorer secoes={secoes} qInicial={q} secaoInicial="" inicial={inicial} />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Legislação
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Escolha o tipo de norma ou busque pelo número ou assunto em toda a legislação.
      </Text>

      <form action="/legislacao" className="mt-8 flex max-w-xl items-center gap-3">
        <div className="relative flex-1">
          <label htmlFor="q" className="sr-only">
            Buscar na legislação
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground-muted" aria-hidden="true" />
          <input
            id="q"
            name="q"
            type="search"
            placeholder="Busque por número, assunto ou palavra da ementa"
            className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      <div className="mt-10 flex flex-wrap gap-2">
        {secoes.map((secao) => (
          <IconTile
            key={secao.id}
            href={`/legislacao/${secao.id}`}
            rotulo={secao.nome}
            icone={<LegislacaoIcon secaoId={secao.id} className="size-6" />}
          />
        ))}
      </div>
    </Container>
  );
}
