import type { ReactNode } from "react";
import { FileCheck2 } from "lucide-react";
import type { Servico } from "@/types/servico";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";
import { LinkButton } from "@/app/components/atoms/Button";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { slugDaCategoria } from "@/lib/data/servicos";
import { limparTexto, temConteudo } from "@/lib/normalize/texto";
import { paraLista, parseDocumentos, parsePrazo, parseTaxas } from "@/lib/normalize/servico";

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
export function ServiceFicha({ servico }: { servico: Servico }) {
  const categoriaSlug = slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria });
  const { abas } = servico;

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
        <div className="mt-6">
          <LinkButton href={`/solicitar/${servico.id}`} size="lg">
            Solicitar serviço
          </LinkButton>
        </div>

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
