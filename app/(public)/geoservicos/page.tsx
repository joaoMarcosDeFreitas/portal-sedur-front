import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { getGeoservicos } from "@/lib/data/sistema-servicos";

export const metadata: Metadata = {
  title: "Geoserviços",
  description: "Catálogo de dados geoespaciais oficiais da SEDUR: bairros, logradouros e áreas de programas.",
};

export default async function GeoservicosPage() {
  const { texto_lido: linhas } = await getGeoservicos();

  // Textos explicativos (com dois erros de digitação do original corrigidos: "WSF" -> "WFS" e
  // "Geospational" -> "Geospatial") e, depois do título do grupo, pares nome/descrição de cada camada.
  const introducao = linhas
    .filter((linha) => linha.length > 100 && !linha.startsWith("Delimitação"))
    .map((linha) => linha.replace("WSF", "WFS").replace("Geospational", "Geospatial"));
  const inicio = linhas.indexOf("Cartografia Salvador");
  const resto = inicio === -1 ? [] : linhas.slice(inicio + 1);
  const camadas = Array.from({ length: Math.floor(resto.length / 2) }, (_, i) => ({
    nome: resto[i * 2],
    descricao: resto[i * 2 + 1],
  }));

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Geoserviços
      </Text>
      <div className="mt-4 flex max-w-2xl flex-col gap-3">
        {introducao.map((paragrafo) => (
          <Text key={paragrafo} tone="muted">
            {paragrafo}
          </Text>
        ))}
      </div>

      <Text as="h2" variant="h2" className="mt-12">
        Cartografia Salvador
      </Text>
      <ul className="mt-6 flex max-w-3xl flex-col gap-6">
        {camadas.map((camada) => (
          <li key={camada.nome} className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-600/10 text-brand">
              <Layers className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading font-semibold text-foreground">{camada.nome}</p>
              <p className="mt-1 text-sm text-foreground-muted">{camada.descricao}</p>
            </div>
          </li>
        ))}
      </ul>
      <Text variant="small" tone="muted" className="mt-10 max-w-2xl">
        Para acessar os serviços WFS dessas camadas, fale com a SEDUR pelos canais de atendimento.
      </Text>
    </Container>
  );
}
