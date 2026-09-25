import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { CategoryIcon } from "@/app/components/atoms/CategoryIcon";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { ServiceListItem } from "@/app/components/molecules/ServiceListItem";
import {
  getCategoriaPorSlug,
  getCategorias,
  getServicosDaCategoria,
  slugDaCategoria,
} from "@/lib/data/servicos";

// Só existem os endereços listados abaixo: qualquer outro é 404 já no servidor (página completa, sem depender de JavaScript).
export const dynamicParams = false;

export async function generateStaticParams() {
  const categorias = await getCategorias();
  return categorias.map((categoria) => ({ categoriaSlug: slugDaCategoria(categoria) }));
}

export async function generateMetadata(props: PageProps<"/servicos/[categoriaSlug]">): Promise<Metadata> {
  const { categoriaSlug } = await props.params;
  const categoria = await getCategoriaPorSlug(categoriaSlug);
  return categoria
    ? { title: categoria.nome, description: `Serviços da SEDUR na categoria ${categoria.nome}.` }
    : {};
}

export default async function CategoriaPage(props: PageProps<"/servicos/[categoriaSlug]">) {
  const { categoriaSlug } = await props.params;
  const categoria = await getCategoriaPorSlug(categoriaSlug);
  if (!categoria) notFound();

  const servicos = await getServicosDaCategoria(categoria.id);

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Serviços", href: "/servicos" }, { rotulo: categoria.nome }]} />

      <div className="mt-6 flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-600/10 text-brand">
          <CategoryIcon nome={categoria.nome} className="size-6" />
        </span>
        <Text as="h1" variant="h1">
          {categoria.nome}
        </Text>
      </div>

      <div className="-mx-4 mt-8 max-w-3xl">
        {servicos.map((servico) => (
          <ServiceListItem key={servico.id} servico={servico} />
        ))}
      </div>
    </Container>
  );
}
