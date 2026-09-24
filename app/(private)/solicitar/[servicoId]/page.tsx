import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { SolicitacaoForm } from "@/app/components/organisms/SolicitacaoForm";
import { getServicoPorId, getTodosOsServicos, slugDaCategoria, slugDoServico } from "@/lib/data/servicos";
import { parseDocumentos, parseTaxas } from "@/lib/normalize/servico";
import { temConteudo } from "@/lib/normalize/texto";

export async function generateStaticParams() {
  const servicos = await getTodosOsServicos();
  return servicos.map((servico) => ({ servicoId: servico.id }));
}

// Título de aba próprio por serviço (WCAG 2.4.2): sem isso as 151 páginas teriam o mesmo título.
export async function generateMetadata(props: PageProps<"/solicitar/[servicoId]">): Promise<Metadata> {
  const { servicoId } = await props.params;
  const servico = await getServicoPorId(servicoId);
  return { title: servico ? `Solicitar: ${servico.nome}` : "Solicitar serviço" };
}

export default async function SolicitarPage(props: PageProps<"/solicitar/[servicoId]">) {
  const { servicoId } = await props.params;
  const servico = await getServicoPorId(servicoId);
  if (!servico) notFound();

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
          { rotulo: "Solicitar" },
        ]}
      />
      <Text as="h1" variant="h1" className="mt-6 max-w-3xl">
        Solicitar: {servico.nome}
      </Text>
      <SolicitacaoForm
        servico={{ id: servico.id, nome: servico.nome, categoria: servico.categoria }}
        documentos={documentos}
        taxas={taxas}
      />
    </Container>
  );
}
