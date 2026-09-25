import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { CategoryIcon } from "@/app/components/atoms/CategoryIcon";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getAreasDeAtuacao } from "@/lib/data/institucional";
import { slugDaCategoria } from "@/lib/data/servicos";

// Só existem os endereços listados abaixo: qualquer outro é 404 já no servidor (página completa, sem depender de JavaScript).
export const dynamicParams = false;

export async function generateStaticParams() {
  const { areas } = await getAreasDeAtuacao();
  return areas.map((area) => ({ area: area.slug }));
}

export async function generateMetadata(props: PageProps<"/institucional/areas-de-atuacao/[area]">): Promise<Metadata> {
  const { area: slug } = await props.params;
  const { areas } = await getAreasDeAtuacao();
  const area = areas.find((a) => a.slug === slug);
  return area ? { title: `${area.titulo} — Áreas de atuação`, description: area.paragrafo.slice(0, 155) } : {};
}

export default async function AreaPage(props: PageProps<"/institucional/areas-de-atuacao/[area]">) {
  const { area: slug } = await props.params;
  const { areas } = await getAreasDeAtuacao();
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  return (
    <Container className="py-12">
      <Breadcrumb
        itens={[
          { rotulo: "Institucional", href: "/institucional" },
          { rotulo: "Áreas de atuação", href: "/institucional/areas-de-atuacao" },
          { rotulo: area.titulo },
        ]}
      />
      <div className="mt-6 flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-600/10 text-brand">
          <CategoryIcon nome={area.categoria} className="size-6" />
        </span>
        <Text as="h1" variant="h1">
          {area.titulo}
        </Text>
      </div>

      <div className="mt-6 max-w-3xl">
        <Text tone="muted">{area.paragrafo}</Text>
        {area.topicos.length > 0 && (
          <ul className="mt-4 list-disc pl-5 text-foreground-muted">
            {area.topicos.map((topico) => (
              <li key={topico}>{topico}</li>
            ))}
          </ul>
        )}
        {area.categoria && (
          <Link
            href={`/servicos/${slugDaCategoria({ id: "", nome: area.categoria })}`}
            className="toque mt-8 cursor-pointer gap-1.5 font-medium text-brand hover:underline"
          >
            Ver serviços desta área <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </Container>
  );
}
