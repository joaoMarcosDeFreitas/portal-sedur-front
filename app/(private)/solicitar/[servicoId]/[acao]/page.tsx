import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { SolicitacaoForm } from "@/app/components/organisms/SolicitacaoForm";
import {
  acoesDoServico,
  getServicoPorId,
  getTodosOsServicos,
  slugDaCategoria,
  slugDoServico,
} from "@/lib/data/servicos";
import { parseDocumentos, parseTaxas } from "@/lib/normalize/servico";
import { temConteudo } from "@/lib/normalize/texto";

// Só existem as ações que a ficha realmente oferece (81 só DAM, 50 só processo, 5 as duas, 15 nenhuma): qualquer
// outro endereço é 404 já no servidor (página completa, sem depender de JavaScript).
export const dynamicParams = false;

export async function generateStaticParams() {
  const servicos = await getTodosOsServicos();
  return servicos.flatMap((servico) => acoesDoServico(servico).map((acao) => ({ servicoId: servico.id, acao: acao.segmento })));
}

async function carregar(servicoId: string, segmento: string) {
  const servico = await getServicoPorId(servicoId);
  const acao = servico ? acoesDoServico(servico).find((a) => a.segmento === segmento) : undefined;
  return servico && acao ? { servico, acao } : undefined;
}

// Título de aba próprio por serviço e ação (WCAG 2.4.2).
export async function generateMetadata(props: PageProps<"/solicitar/[servicoId]/[acao]">): Promise<Metadata> {
  const { servicoId, acao: segmento } = await props.params;
  const achado = await carregar(servicoId, segmento);
  return { title: achado ? `${achado.acao.rotulo}: ${achado.servico.nome}` : "Solicitar serviço" };
}

export default async function SolicitarPage(props: PageProps<"/solicitar/[servicoId]/[acao]">) {
  const { servicoId, acao: segmento } = await props.params;
  const achado = await carregar(servicoId, segmento);
  if (!achado) notFound();
  const { servico, acao } = achado;

  const categoriaSlug = slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria });
  const documentos = temConteudo(servico.abas["documentacao-exigida"])
    ? parseDocumentos(servico.abas["documentacao-exigida"] ?? "").map(({ titulo, indispensavel }) => ({
        titulo,
        indispensavel,
      }))
    : [];
  const taxas = temConteudo(servico.abas.taxas) ? parseTaxas(servico.abas.taxas ?? "").itens : [];

  return (
    <Container className="py-12">
      <Breadcrumb
        itens={[
          { rotulo: "Serviços", href: "/servicos" },
          { rotulo: servico.categoria, href: `/servicos/${categoriaSlug}` },
          { rotulo: servico.nome, href: `/servicos/${categoriaSlug}/${slugDoServico(servico)}` },
          { rotulo: acao.rotulo },
        ]}
      />
      <Text as="h1" variant="h1" className="mt-6 max-w-3xl">
        {acao.rotulo}: {servico.nome}
      </Text>
      <SolicitacaoForm
        servico={{ id: servico.id, nome: servico.nome, categoria: servico.categoria }}
        acao={acao.tipo}
        documentos={acao.tipo === "processo" ? documentos : []}
        taxas={taxas}
      />
    </Container>
  );
}
