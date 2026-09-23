import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { LegislacaoIcon } from "@/app/components/atoms/LegislacaoIcon";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { IconTile } from "@/app/components/molecules/IconTile";
import { LegislacaoExplorer } from "@/app/components/organisms/LegislacaoExplorer";
import { buscarLegislacao, getResumoSecoes } from "@/lib/data/legislacao";

const um = (valor: string | string[] | undefined) => (Array.isArray(valor) ? valor[0] : valor) ?? "";

export async function generateMetadata(props: PageProps<"/legislacao/[secao]">): Promise<Metadata> {
  const { secao: id } = await props.params;
  const secao = (await getResumoSecoes()).find((s) => s.id === id);
  return secao ? { title: `${secao.nome} — Legislação`, description: `Normas do tipo ${secao.nome}.` } : {};
}

/**
 * Tipo de norma. Se ele se divide (CNLU, Desapropriação, LOUOS, PDDU, Taxas/Multas), mostra os
 * ícones dos subtipos; senão (ou com `?todos=1`) mostra direto a lista de documentos.
 */
export default async function SecaoPage(props: PageProps<"/legislacao/[secao]">) {
  const [{ secao: id }, busca] = await Promise.all([props.params, props.searchParams]);
  const secoes = await getResumoSecoes();
  const secao = secoes.find((s) => s.id === id);
  if (!secao) notFound();

  const verTodos = um(busca.todos) === "1";
  const q = um(busca.q).trim();
  const migalhas = [{ rotulo: "Legislação", href: "/legislacao" }, { rotulo: secao.nome }];

  if (secao.subsecoes && !verTodos && !q) {
    return (
      <Container className="py-12">
        <Breadcrumb itens={migalhas} />
        <Text as="h1" variant="h1" className="mt-6">
          {secao.nome}
        </Text>
        <Text tone="muted" className="mt-3 max-w-2xl">
          Escolha o tipo de documento.
        </Text>
        <div className="mt-8 flex flex-wrap gap-2">
          {secao.subsecoes.map((sub) => (
            <IconTile
              key={sub.id}
              href={`/legislacao/${secao.id}/${sub.id}`}
              rotulo={sub.nome}
              icone={<LegislacaoIcon secaoId={secao.id} subsecaoId={sub.id} className="size-6" />}
            />
          ))}
        </div>
        <Link
          href={`/legislacao/${secao.id}?todos=1`}
          className="mt-8 inline-block cursor-pointer text-sm font-medium text-brand hover:underline"
        >
          Ver todos os documentos de {secao.nome}
        </Link>
      </Container>
    );
  }

  const inicial = await buscarLegislacao({ secao: secao.id, q });
  return (
    <Container className="py-12">
      <Breadcrumb itens={migalhas} />
      <Text as="h1" variant="h1" className="mt-6">
        {secao.nome}
      </Text>
      <div className="mt-8">
        <LegislacaoExplorer secoes={secoes} qInicial={q} secaoInicial={secao.id} travarTipo inicial={inicial} />
      </div>
    </Container>
  );
}
