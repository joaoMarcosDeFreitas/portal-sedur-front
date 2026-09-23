import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { LegislacaoExplorer } from "@/app/components/organisms/LegislacaoExplorer";
import { buscarLegislacao, getResumoSecoes } from "@/lib/data/legislacao";

const um = (valor: string | string[] | undefined) => (Array.isArray(valor) ? valor[0] : valor) ?? "";

async function achar(idSecao: string, idSub: string) {
  const secao = (await getResumoSecoes()).find((s) => s.id === idSecao);
  const sub = secao?.subsecoes?.find((s) => s.id === idSub);
  return secao && sub ? { secao, sub } : undefined;
}

export async function generateMetadata(props: PageProps<"/legislacao/[secao]/[sub]">): Promise<Metadata> {
  const { secao: idSecao, sub: idSub } = await props.params;
  const achado = await achar(idSecao, idSub);
  return achado ? { title: `${achado.sub.nome} — ${achado.secao.nome}`, description: `${achado.secao.nome}: ${achado.sub.nome}.` } : {};
}

/** Lista de documentos de um subtipo (ex.: CNLU › Comunicados). */
export default async function SubsecaoPage(props: PageProps<"/legislacao/[secao]/[sub]">) {
  const [{ secao: idSecao, sub: idSub }, busca] = await Promise.all([props.params, props.searchParams]);
  const achado = await achar(idSecao, idSub);
  if (!achado) notFound();

  const { secao, sub } = achado;
  const q = um(busca.q).trim();
  const inicial = await buscarLegislacao({ secao: secao.id, subsecao: sub.id, q });
  const secoes = await getResumoSecoes();

  return (
    <Container className="py-12">
      <Breadcrumb
        itens={[
          { rotulo: "Legislação", href: "/legislacao" },
          { rotulo: secao.nome, href: `/legislacao/${secao.id}` },
          { rotulo: sub.nome },
        ]}
      />
      <Text as="h1" variant="h1" className="mt-6">
        {secao.nome} — {sub.nome}
      </Text>
      <div className="mt-8">
        <LegislacaoExplorer
          secoes={secoes}
          qInicial={q}
          secaoInicial={secao.id}
          travarTipo
          subsecao={sub.id}
          inicial={inicial}
        />
      </div>
    </Container>
  );
}
