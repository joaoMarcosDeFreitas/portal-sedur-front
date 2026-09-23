import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Button } from "@/app/components/atoms/Button";
import { NewsCard } from "@/app/components/molecules/NewsCard";
import { Pagination } from "@/app/components/molecules/Pagination";
import { buscarNoticias, getAnosDasNoticias } from "@/lib/data/noticias";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Notícias e comunicados da Secretaria Municipal de Desenvolvimento Urbano de Salvador.",
};

const um = (valor: string | string[] | undefined) => (Array.isArray(valor) ? valor[0] : valor) ?? "";

export default async function NoticiasPage(props: PageProps<"/noticias">) {
  const params = await props.searchParams;
  const q = um(params.q).trim();
  const ano = um(params.ano);
  const pagina = Math.max(1, Number(um(params.pagina)) || 1);

  const [anos, { itens, total, paginas }] = await Promise.all([
    getAnosDasNoticias(),
    buscarNoticias({ q, ano: ano || undefined, pagina }),
  ]);

  const hrefDe = (p: number) => {
    const busca = new URLSearchParams();
    if (q) busca.set("q", q);
    if (ano) busca.set("ano", ano);
    if (p > 1) busca.set("pagina", String(p));
    const texto = busca.toString();
    return texto ? `/noticias?${texto}` : "/noticias";
  };

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Notícias
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Acompanhe as ações, decisões e comunicados da SEDUR.
      </Text>

      <form action="/noticias" className="mt-8 flex max-w-2xl flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <label htmlFor="q" className="sr-only">
            Buscar notícias
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground-muted" aria-hidden="true" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por título ou texto"
            className="w-full rounded-full border border-border bg-surface py-3 pl-12 pr-5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <label htmlFor="ano" className="sr-only">
          Ano
        </label>
        <select
          id="ano"
          name="ano"
          defaultValue={ano}
          className="cursor-pointer rounded-full border border-border bg-surface px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todos os anos</option>
          {anos.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
        <Button type="submit">Filtrar</Button>
        {(q || ano) && (
          <Link href="/noticias" className="cursor-pointer text-sm text-brand hover:underline">
            Limpar
          </Link>
        )}
      </form>

      <p className="mt-6 text-sm text-foreground-muted" aria-live="polite">
        {total.toLocaleString("pt-BR")} {total === 1 ? "notícia" : "notícias"}
        {paginas > 1 ? ` · página ${pagina} de ${paginas}` : ""}
      </p>

      {itens.length === 0 ? (
        <p className="mt-6 max-w-xl text-foreground-muted">Nenhuma notícia encontrada para essa busca.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((noticia) => (
            <NewsCard key={noticia.id} noticia={noticia} mostrarResumo />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Pagination paginaAtual={pagina} totalPaginas={paginas} hrefDe={hrefDe} />
      </div>
    </Container>
  );
}
