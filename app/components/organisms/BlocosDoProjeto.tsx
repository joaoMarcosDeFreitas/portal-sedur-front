import Image from "next/image";
import Link from "next/link";
import { Text } from "@/app/components/atoms/Text";
import type { BlocoPronto, TrechoPronto } from "@/lib/data/institucional";

const LINK = "cursor-pointer text-brand underline underline-offset-2 hover:no-underline";

function Trecho({ trecho }: { trecho: TrechoPronto }) {
  let conteudo: React.ReactNode = trecho.texto;
  if (trecho.italico) conteudo = <em>{conteudo}</em>;
  if (trecho.negrito) conteudo = <strong className="font-semibold text-foreground">{conteudo}</strong>;

  if (trecho.href && trecho.interno) {
    return (
      <Link href={trecho.href} className={LINK}>
        {conteudo}
      </Link>
    );
  }
  if (trecho.href) {
    return (
      <a href={trecho.href} target="_blank" rel="noreferrer" className={LINK}>
        {conteudo}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  if (trecho.indisponivel) {
    return (
      <>
        {conteudo} <span className="text-sm italic">(link indisponível no portal atual)</span>
      </>
    );
  }
  return <>{conteudo}</>;
}

const Trechos = ({ trechos }: { trechos: TrechoPronto[] }) => (
  <>
    {trechos.map((trecho, indice) => (
      <Trecho key={indice} trecho={trecho} />
    ))}
  </>
);

/** Conteúdo de um projeto como no site atual: parágrafos com links no meio do texto, listas, tabela, títulos e imagens. */
export function BlocosDoProjeto({ blocos }: { blocos: BlocoPronto[] }) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {blocos.map((bloco, indice) => {
        switch (bloco.tipo) {
          case "paragrafo":
            return (
              <Text key={indice} tone="muted">
                <Trechos trechos={bloco.runs} />
              </Text>
            );
          case "titulo":
            return (
              <Text key={indice} as="h2" variant="h3" className="mt-4">
                <Trechos trechos={bloco.runs} />
              </Text>
            );
          case "lista": {
            const Tag = bloco.ordenada ? "ol" : "ul";
            return (
              <Tag key={indice} className={`flex flex-col gap-2 pl-5 text-foreground-muted ${bloco.ordenada ? "list-decimal" : "list-disc"}`}>
                {bloco.itens.map((item, i) => (
                  <li key={i}>
                    <Trechos trechos={item} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "tabela":
            return (
              // tabIndex + role/aria-label: no celular a tabela rola para o lado e precisa poder ser rolada pelo teclado.
              <div key={indice} tabIndex={0} role="region" aria-label={`Tabela: ${bloco.cabecalho.slice(1).join(" e ").toLowerCase()}`} className="relative overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                  <thead className="bg-surface-muted">
                    <tr>
                      {bloco.cabecalho.map((titulo, i) => (
                        <th key={i} scope="col" className="px-3 py-2.5 font-heading font-semibold text-foreground">
                          {titulo}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bloco.linhas.map((linha, l) => (
                      <tr key={l} className="border-t border-border">
                        {linha.map((celula, c) => (
                          <td key={c} className="px-3 py-2.5 align-top text-foreground-muted">
                            {celula}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "imagem": {
            const largura = bloco.largura ?? bloco.larguraReal;
            const imagem = (
              <Image
                src={bloco.src}
                alt={bloco.alt}
                width={largura}
                height={Math.round((largura * bloco.alturaReal) / bloco.larguraReal)}
                sizes={`(min-width: 1024px) ${largura}px, 100vw`}
                className="h-auto max-w-full rounded-lg"
              />
            );
            return (
              <div key={indice}>
                {bloco.href ? (
                  <a href={bloco.href} target="_blank" rel="noreferrer" className="inline-block cursor-pointer">
                    {imagem}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                ) : (
                  imagem
                )}
              </div>
            );
          }
        }
      })}
    </div>
  );
}
