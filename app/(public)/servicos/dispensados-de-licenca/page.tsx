import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getServicosDispensadosDeLicenca } from "@/lib/data/sistema-servicos";

export const metadata: Metadata = {
  title: "Serviços dispensados de licença",
  description: "Obras e serviços simples que não precisam de licença da SEDUR.",
};

const GRUPOS = ["Reparos Gerais", "Obras em Logradouro Público", "Especiais"];

/** Cada item termina em ";" — as linhas quebradas no meio da frase são coladas até esse ponto. */
function agrupar(linhas: string[]) {
  const grupos: { titulo: string; itens: string[] }[] = [];
  let pendente: string[] = [];
  for (const linha of linhas) {
    if (GRUPOS.includes(linha)) {
      grupos.push({ titulo: linha, itens: [] });
      pendente = [];
    } else if (grupos.length > 0 && !/^(Clique aqui|Grupo I)/.test(linha)) {
      pendente.push(linha);
      if (/[;.]$/.test(linha)) {
        grupos[grupos.length - 1].itens.push(pendente.join(" ").replace(/[;.]$/, ""));
        pendente = [];
      }
    }
  }
  return grupos;
}

export default async function DispensadosPage() {
  const { texto_lido } = await getServicosDispensadosDeLicenca();
  const grupos = agrupar(texto_lido);

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Serviços", href: "/servicos" }, { rotulo: "Dispensados de licença" }]} />
      <Text as="h1" variant="h1" className="mt-6">
        Serviços dispensados de licença
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Estas obras e serviços podem ser feitos sem pedir licença à SEDUR.
      </Text>

      <div className="mt-10 flex max-w-3xl flex-col gap-10">
        {grupos.map((grupo) => (
          <section key={grupo.titulo}>
            <Text as="h2" variant="h3">
              {grupo.titulo}
            </Text>
            <ul className="mt-4 flex flex-col gap-3">
              {grupo.itens.map((item) => (
                <li key={item} className="flex gap-3 text-foreground-muted">
                  <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
