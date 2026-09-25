import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getProjetoPorSlug, getProjetos } from "@/lib/data/institucional";

// Só existem os endereços listados abaixo: qualquer outro é 404 já no servidor (página completa, sem depender de JavaScript).
export const dynamicParams = false;

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
        {projeto.resumo && (
          <Text className="mt-3 text-lg">{projeto.resumo}</Text>
        )}
        {projeto.blocos ? (
          // Página informativa (IPTU Verde, Revisão do PDDU): cada bloco tem título, texto, lista e fecho.
          projeto.blocos.map((bloco) => (
            <section key={bloco.titulo} className="mt-10">
              <Text as="h2" variant="h3">
                {bloco.titulo}
              </Text>
              <div className="mt-4 flex flex-col gap-4">
                {bloco.paragrafos?.map((paragrafo, indice) => (
                  <Text key={indice} tone="muted">
                    {paragrafo}
                  </Text>
                ))}
                {bloco.subtitulo && (
                  <p className="mt-2 font-heading font-semibold text-foreground">{bloco.subtitulo}</p>
                )}
                {bloco.itens && (
                  <ul className="flex list-disc flex-col gap-2 pl-5 text-foreground-muted">
                    {bloco.itens.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {bloco.fecho && <Text tone="muted">{bloco.fecho}</Text>}
              </div>
            </section>
          ))
        ) : (
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
        )}

        {projeto.links.length > 0 && (
          <section className="mt-10">
            <Text as="h2" variant="h3">
              {projeto.blocos ? "Formulários, documentos e links" : "Documentos e serviços relacionados"}
            </Text>
            <ul className="mt-4 flex flex-col gap-2.5">
              {projeto.links.map((link) => (
                <li key={`${link.texto}-${link.url}`}>
                  {link.interno ? (
                    <Link href={link.url} className="toque cursor-pointer gap-2 text-brand hover:underline">
                      <FileText className="size-4 shrink-0" aria-hidden="true" />
                      {link.texto} (ver serviço)
                    </Link>
                  ) : (
                    <a href={link.url} target="_blank" rel="noreferrer" className="toque cursor-pointer gap-2 text-brand hover:underline">
                      <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                      {link.texto}
                      <span className="sr-only"> (abre em nova aba)</span>
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
