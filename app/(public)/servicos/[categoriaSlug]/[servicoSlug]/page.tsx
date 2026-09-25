import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceFicha } from "@/app/components/organisms/ServiceFicha";
import {
  getServicoPorSlug,
  getTodosOsServicos,
  slugDaCategoria,
  slugDoServico,
} from "@/lib/data/servicos";
import { paraParagrafo } from "@/lib/normalize/servico";
import { limparTexto } from "@/lib/normalize/texto";

// Só existem os endereços listados abaixo: qualquer outro é 404 já no servidor (página completa, sem depender de JavaScript).
export const dynamicParams = false;

export async function generateStaticParams() {
  const servicos = await getTodosOsServicos();
  return servicos.map((servico) => ({
    categoriaSlug: slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria }),
    servicoSlug: slugDoServico(servico),
  }));
}

export async function generateMetadata(
  props: PageProps<"/servicos/[categoriaSlug]/[servicoSlug]">,
): Promise<Metadata> {
  const { categoriaSlug, servicoSlug } = await props.params;
  const servico = await getServicoPorSlug(categoriaSlug, servicoSlug);
  if (!servico) return {};
  const descricao = paraParagrafo(limparTexto(servico.abas.descricao));
  return {
    title: servico.nome,
    description: descricao ? `${descricao.slice(0, 155)}…` : `Serviço da SEDUR: ${servico.nome}.`,
  };
}

export default async function ServicoPage(props: PageProps<"/servicos/[categoriaSlug]/[servicoSlug]">) {
  const { categoriaSlug, servicoSlug } = await props.params;
  const servico = await getServicoPorSlug(categoriaSlug, servicoSlug);
  if (!servico) notFound();

  return <ServiceFicha servico={servico} />;
}
