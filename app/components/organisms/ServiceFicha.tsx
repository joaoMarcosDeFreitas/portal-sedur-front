import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Download, FileCheck2 } from "lucide-react";
import type { Servico } from "@/types/servico";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";
import { LinkButton } from "@/app/components/atoms/Button";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { acoesDoServico, resolverLinkDeFicha, slugDaCategoria, type LinkResolvido } from "@/lib/data/servicos";
import { limparTexto, temConteudo } from "@/lib/normalize/texto";
import { linksDoDocumento, paraLista, parseDocumentos, parsePrazo, parseTaxas } from "@/lib/normalize/servico";

function Secao({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <Text as="h2" variant="h3" id={id}>
        {titulo}
      </Text>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Tipo do arquivo pelo endereço, para dizer ao leitor o que vai baixar ("PDF", "ZIP"...). */
function tipoDoArquivo(url: string): string {
  const extensao = url.split("?")[0].match(/\.([a-z0-9]{2,4})$/i)?.[1];
  return extensao ? extensao.toUpperCase() : "arquivo";
}

/**
 * Link que vem dentro de uma aba do portal antigo: outra ficha deste portal (segue no mesmo site) ou
 * um arquivo para baixar (abre em nova aba; o tipo aparece no texto e no nome acessível).
 */
function LinkDeArquivo({ link, documento }: { link: LinkResolvido; documento?: string }) {
  const classes = "toque cursor-pointer gap-2 text-sm font-medium text-brand hover:underline";
  if (link.interno) {
    return (
      <Link href={link.url} className={classes}>
        {documento ? "Ver o serviço" : link.texto} <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    );
  }
  const tipo = tipoDoArquivo(link.url);
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Baixar ${link.texto} (${tipo}, abre em nova aba)`}
      className={classes}
    >
      <Download className="size-4" aria-hidden="true" />
      {documento ? `Baixar modelo · ${tipo}` : `${link.texto} · ${tipo}`}
    </a>
  );
}

function Paragrafos({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col gap-3">
      {paraLista(texto).map((linha, indice) => (
        <Text key={indice} tone="muted">
          {linha}
        </Text>
      ))}
    </div>
  );
}

/**
 * Ficha de um serviço da Carta de Serviços. Tudo numa página só (no portal atual as 6 abas
 * carregavam uma a uma ao clicar). Seções sem conteúdo real ("N/A", vazias) não aparecem.
 */
export async function ServiceFicha({ servico }: { servico: Servico }) {
  const categoriaSlug = slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria });
  const { abas } = servico;
  const acoes = acoesDoServico(servico);
  const [linksDocumentos, linksInformacoes] = await Promise.all([
    Promise.all((servico.links_nas_abas?.["documentacao-exigida"] ?? []).map(resolverLinkDeFicha)),
    Promise.all((servico.links_nas_abas?.informacoes ?? []).map(resolverLinkDeFicha)),
  ]);

  const descricao = limparTexto(abas.descricao);
  const documentos = temConteudo(abas["documentacao-exigida"])
    ? parseDocumentos(abas["documentacao-exigida"] ?? "")
    : [];
  const taxas = temConteudo(abas.taxas) ? parseTaxas(abas.taxas ?? "") : { itens: [] };
  const prazo = temConteudo(abas.prazo) ? parsePrazo(abas.prazo ?? "") : undefined;
  const informacoes = limparTexto(abas.informacoes);
  const local = limparTexto(abas.local);

  return (
    <Container className="py-12">
      <Breadcrumb
        itens={[
          { rotulo: "Serviços", href: "/servicos" },
          { rotulo: servico.categoria, href: `/servicos/${categoriaSlug}` },
          { rotulo: servico.nome },
        ]}
      />

      <div className="mt-6 max-w-3xl">
        <Text as="h1" variant="h1">
          {servico.nome}
        </Text>
        {prazo?.principal && (
          <Text tone="muted" className="mt-3">
            Prazo: {prazo.principal.replace(/\.$/, "")}
          </Text>
        )}
        {acoes.length > 0 ? (
          <div className="mt-6">
            {/* Os botões que o portal atual realmente oferece nesta ficha (só DAM, só processo ou os dois). */}
            <div className="flex flex-wrap gap-3">
              {acoes.map((acao, indice) => (
                <LinkButton key={acao.segmento} href={acao.href} size="lg" variant={indice === 0 ? "primary" : "secondary"}>
                  {acao.rotulo}
                </LinkButton>
              ))}
            </div>
            <p className="mt-3 max-w-xl text-xs text-foreground-muted">
              {acoes.some((acao) => acao.tipo === "dam") && "DAM é o Documento de Arrecadação Municipal, a guia para pagar a taxa. "}
              Para continuar é preciso entrar (aqui, com um login de demonstração).
            </p>
          </div>
        ) : (
          <p className="mt-6 max-w-xl rounded-xl bg-surface-muted px-4 py-3 text-sm text-foreground-muted">
            Este serviço não tem botão de solicitação no Portal de Serviços. Veja as orientações abaixo e, se tiver
            dúvidas, fale com a SEDUR pelos{" "}
            <Link href="/canais-de-atendimento" className="font-medium text-brand hover:underline">
              canais de atendimento
            </Link>
            .
          </p>
        )}

        {temConteudo(descricao) && (
          <Secao id="descricao" titulo="Sobre o serviço">
            <Paragrafos texto={descricao} />
          </Secao>
        )}

        {documentos.length > 0 && (
          <Secao id="documentos" titulo="Documentos necessários">
            <ul className="flex flex-col gap-5">
              {documentos.map((documento, indice) => (
                <li key={`${documento.titulo}-${indice}`} className="flex gap-3">
                  <FileCheck2 className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
                  <div>
                    <p className="font-medium text-foreground">{documento.titulo}</p>
                    {documento.indispensavel && (
                      <div className="mt-1.5">
                        <Badge tone="warning">Indispensável para análise</Badge>
                      </div>
                    )}
                    {documento.observacoes.map((observacao, i) => (
                      <p key={i} className="mt-1.5 text-sm text-foreground-muted">
                        {observacao}
                      </p>
                    ))}
                    {linksDoDocumento(documento.titulo, linksDocumentos).map((link) => (
                      <LinkDeArquivo key={link.url} link={link} documento={documento.titulo} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Secao>
        )}

        {taxas.itens.length > 0 && (
          <Secao id="taxas" titulo="Taxas">
            <dl className="flex flex-col gap-2.5">
              {taxas.itens.map((taxa, indice) => (
                <div key={`${taxa.descricao}-${indice}`} className="flex items-baseline justify-between gap-6">
                  <dt className="text-foreground">{taxa.descricao}</dt>
                  <dd className="shrink-0 font-medium tabular-nums text-foreground">{taxa.valor}</dd>
                </div>
              ))}
            </dl>
            {taxas.nota && <p className="mt-4 text-xs leading-relaxed text-foreground-muted">{taxas.nota}</p>}
          </Secao>
        )}

        {prazo && (
          <Secao id="prazo" titulo="Prazo">
            <Text>{prazo.principal}</Text>
            {prazo.observacoes.map((observacao, indice) => (
              <Text key={indice} tone="muted" variant="small" className="mt-2">
                {observacao}
              </Text>
            ))}
          </Secao>
        )}

        {temConteudo(informacoes) && (
          <Secao id="informacoes" titulo="Informações">
            <Paragrafos texto={informacoes} />
            {linksInformacoes.length > 0 && (
              <ul className="mt-4 flex flex-col gap-1">
                {linksInformacoes.map((link) => (
                  <li key={link.url}>
                    <LinkDeArquivo link={link} />
                  </li>
                ))}
              </ul>
            )}
          </Secao>
        )}

        {temConteudo(local) && (
          <Secao id="local" titulo="Local e horário">
            <Paragrafos texto={local} />
          </Secao>
        )}
      </div>
    </Container>
  );
}
