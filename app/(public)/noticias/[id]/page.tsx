import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getNoticiaPorId, getTodasAsNoticias, getVizinhas } from "@/lib/data/noticias";
import { dataPorExtenso } from "@/lib/normalize/data";

// Só existem as notícias listadas: qualquer outro id é 404 já no servidor (HTML completo, sem depender de JavaScript).
export const dynamicParams = false;

export async function generateStaticParams() {
  const noticias = await getTodasAsNoticias();
  return noticias.map((noticia) => ({ id: String(noticia.id) }));
}

export async function generateMetadata(props: PageProps<"/noticias/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const noticia = await getNoticiaPorId(Number(id));
  if (!noticia) return {};
  const resumo = noticia.paragrafos?.[0];
  return { title: noticia.titulo, description: resumo ? `${resumo.slice(0, 155)}…` : undefined };
}

export default async function NoticiaPage(props: PageProps<"/noticias/[id]">) {
  const { id } = await props.params;
  const noticia = await getNoticiaPorId(Number(id));
  if (!noticia) notFound();

  const { maisRecente, maisAntiga } = await getVizinhas(noticia.id);
  const paragrafos = noticia.paragrafos ?? [];

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Notícias", href: "/noticias" }, { rotulo: dataPorExtenso(noticia.data) }]} />

      <article className="mt-6 max-w-3xl">
        <Text as="p" variant="eyebrow" tone="accent">
          {dataPorExtenso(noticia.data)}
        </Text>
        <Text as="h1" variant="h1" className="mt-3">
          {noticia.titulo}
        </Text>


        <div className="mt-8 flex flex-col gap-5">
          {paragrafos.length > 0 ? (
            paragrafos.map((paragrafo, indice) => (
              <Text key={indice} className="leading-8">
                {paragrafo}
              </Text>
            ))
          ) : (
            <Text tone="muted">
              O texto completo desta notícia ainda não foi migrado para o novo portal. Enquanto isso, você pode ler a
              publicação original no site atual da SEDUR.
            </Text>
          )}
        </div>

        {(noticia.links_no_corpo?.length ?? 0) > 0 && (
          <div className="mt-8">
            <Text as="h2" variant="h3">
              Links citados
            </Text>
            <ul className="mt-3 flex flex-col gap-2">
              {noticia.links_no_corpo?.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noreferrer" className="cursor-pointer text-brand hover:underline">
                    {link.texto || link.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <a
          href={noticia.url}
          target="_blank"
          rel="noreferrer"
          className="toque mt-8 cursor-pointer gap-2 text-sm text-foreground-muted hover:text-brand"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Ver publicação original
        </a>
      </article>

      <nav aria-label="Outras notícias" className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {maisRecente ? (
          <Link href={`/noticias/${maisRecente.id}`} className="group flex cursor-pointer flex-col gap-1 rounded-2xl p-4 hover:bg-surface-muted">
            <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-foreground-muted">
              <ArrowLeft className="size-3.5" aria-hidden="true" /> Notícia mais recente
            </span>
            <span className="font-heading font-medium text-foreground group-hover:text-brand">{maisRecente.titulo}</span>
          </Link>
        ) : (
          <span />
        )}
        {maisAntiga && (
          <Link href={`/noticias/${maisAntiga.id}`} className="group flex cursor-pointer flex-col gap-1 rounded-2xl p-4 text-right hover:bg-surface-muted sm:col-start-2">
            <span className="flex items-center justify-end gap-2 text-xs uppercase tracking-wide text-foreground-muted">
              Notícia mais antiga <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
            <span className="font-heading font-medium text-foreground group-hover:text-brand">{maisAntiga.titulo}</span>
          </Link>
        )}
      </nav>
    </Container>
  );
}
