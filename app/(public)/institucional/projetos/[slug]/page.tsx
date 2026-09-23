import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getProjetoPorSlug, getProjetos } from "@/lib/data/institucional";

export async function generateStaticParams() {
  const projetos = await getProjetos();
  return projetos.map((projeto) => ({ slug: projeto.slug }));
}

export async function generateMetadata(props: PageProps<"/institucional/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const projeto = await getProjetoPorSlug(slug);
  return projeto ? { title: projeto.nome, description: projeto.paragrafos[0]?.slice(0, 155) } : {};
}

export default async function ProjetoPage(props: PageProps<"/institucional/projetos/[slug]">) {
  const { slug } = await props.params;
  const projeto = await getProjetoPorSlug(slug);
  if (!projeto) notFound();

  return (
    <Container className="py-12">
      <Breadcrumb
        itens={[
          { rotulo: "Institucional", href: "/institucional" },
          { rotulo: "Programas e projetos", href: "/institucional/projetos" },
          { rotulo: projeto.nome },
        ]}
      />
      <div className="mt-6 max-w-3xl">
        <Text as="h1" variant="h1">
          {projeto.nome}
        </Text>
        <div className="mt-6 flex flex-col gap-4">
          {projeto.paragrafos.length > 0 ? (
            projeto.paragrafos.map((paragrafo, indice) => (
              <Text key={indice} tone="muted">
                {paragrafo}
              </Text>
            ))
          ) : (
            <Text tone="muted">O conteúdo deste programa ainda está sendo preparado para o novo portal.</Text>
          )}
        </div>

        {projeto.links.length > 0 && (
          <section className="mt-10">
            <Text as="h2" variant="h3">
              Documentos e serviços relacionados
            </Text>
            <ul className="mt-4 flex flex-col gap-2.5">
              {projeto.links.map((link) => (
                <li key={`${link.texto}-${link.url}`}>
                  {link.interno ? (
                    <Link href={link.url} className="inline-flex cursor-pointer items-center gap-2 text-brand hover:underline">
                      <FileText className="size-4 shrink-0" aria-hidden="true" />
                      {link.texto} (ver serviço)
                    </Link>
                  ) : (
                    <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex cursor-pointer items-center gap-2 text-brand hover:underline">
                      <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                      {link.texto}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Container>
  );
}
