import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getItensDeTransparenciaDoSite } from "@/lib/data/transparencia";
import { parseProcesso, rotuloDoArquivo } from "@/lib/normalize/transparencia";

export const metadata: Metadata = {
  title: "Estudos de Impacto de Vizinhança (EIV/RIV)",
  description: "Processos de licenciamento com Estudo e Relatório de Impacto de Vizinhança e seus documentos.",
};

export default async function EivRivPage() {
  const itens = await getItensDeTransparenciaDoSite();
  const processos = itens.flatMap((item) => item.processos ?? []);

  return (
    <Container className="py-12">
      <Breadcrumb
        itens={[{ rotulo: "Transparência", href: "/transparencia" }, { rotulo: "Estudos de Impacto de Vizinhança" }]}
      />
      <Text as="h1" variant="h1" className="mt-6 max-w-3xl">
        Estudos de Impacto de Vizinhança (EIV/RIV)
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        EIV é o Estudo e RIV o Relatório de Impacto de Vizinhança, exigidos de empreendimentos com efeito relevante no
        entorno.
      </Text>

      <ul className="mt-10 flex max-w-3xl flex-col gap-8">
        {processos.map((processo) => {
          const dados = parseProcesso(processo.texto_do_link);
          return (
            <li key={processo.url}>
              <p className="font-heading font-semibold text-foreground">{dados.empreendimento ?? "Processo"}</p>
              <p className="mt-0.5 text-sm text-foreground-muted">
                {[
                  dados.processo && `Processo ${dados.processo}`,
                  dados.local,
                  dados.empreendedor && `Empreendedor: ${dados.empreendedor}`,
                  processo.ano,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <details className="group mt-3">
                <summary className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-brand hover:underline">
                  Ver {processo.arquivos.length} documentos
                </summary>
                <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                  {processo.arquivos.map((arquivo) => (
                    <li key={arquivo.arquivo}>
                      <a
                        href={arquivo.arquivo}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer text-foreground-muted hover:text-brand hover:underline"
                      >
                        {rotuloDoArquivo(arquivo.nome)}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
