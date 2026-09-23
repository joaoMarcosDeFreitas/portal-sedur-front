import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { MappedIcon } from "@/app/components/atoms/MappedIcon";
import { Text } from "@/app/components/atoms/Text";
import { IconTile } from "@/app/components/molecules/IconTile";
import { getConsultas } from "@/lib/data/consultas";
import { getPainelDeTransparencia } from "@/lib/data/sistema-servicos";
import { iconeDeTransparencia } from "@/lib/ui/secoes-icons";

export const metadata: Metadata = {
  title: "Transparência",
  description: "Painéis, audiências públicas e estudos de impacto de vizinhança da SEDUR em um só lugar.",
};

export default async function TransparenciaPage() {
  const [paineis, painelDoPortal] = await Promise.all([getConsultas("transparencia"), getPainelDeTransparencia()]);
  const pdfCovid = painelDoPortal.itens.find((item) => item.tipo === "arquivo PDF");

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Transparência
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Dados abertos sobre licenças, fiscalização e processos com impacto na cidade, agora em um único lugar. Escolha
        um assunto.
      </Text>

      <div className="mt-10 flex flex-wrap gap-2">
        {paineis.map((painel) => (
          <IconTile
            key={painel.slug}
            href={`/transparencia/${painel.slug}`}
            rotulo={painel.titulo}
            icone={<MappedIcon icone={iconeDeTransparencia(painel.slug)} className="size-6" />}
          />
        ))}
        {pdfCovid && (
          <IconTile
            externo
            href={pdfCovid.url.replace(/^http:/, "https:").replace(/ /g, "%20")}
            rotulo={`${pdfCovid.nome} (PDF)`}
            icone={<MappedIcon icone={iconeDeTransparencia("acoes-fiscais-covid")} className="size-6" />}
          />
        )}
        <IconTile
          href="/transparencia/audiencias-publicas"
          rotulo="Audiências públicas"
          icone={<MappedIcon icone={iconeDeTransparencia("audiencias-publicas")} className="size-6" />}
        />
        <IconTile
          href="/transparencia/eiv-riv"
          rotulo="Estudos de Impacto de Vizinhança (EIV/RIV)"
          icone={<MappedIcon icone={iconeDeTransparencia("eiv-riv")} className="size-6" />}
        />
      </div>
    </Container>
  );
}
