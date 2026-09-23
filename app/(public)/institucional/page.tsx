import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { MappedIcon } from "@/app/components/atoms/MappedIcon";
import { Text } from "@/app/components/atoms/Text";
import { IconTile } from "@/app/components/molecules/IconTile";
import { getAreasDeAtuacao } from "@/lib/data/institucional";
import { ICONE_INSTITUCIONAL } from "@/lib/ui/secoes-icons";

export const metadata: Metadata = {
  title: "Institucional",
  description: "Conheça a SEDUR: áreas de atuação, projetos, dirigentes e estrutura organizacional.",
};

export default async function InstitucionalPage() {
  const { introducao } = await getAreasDeAtuacao();

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Institucional
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        {introducao}
      </Text>

      <div className="mt-10 flex flex-wrap gap-2">
        <IconTile
          href="/institucional/areas-de-atuacao"
          rotulo="Áreas de atuação"
          icone={<MappedIcon icone={ICONE_INSTITUCIONAL.areas} className="size-6" />}
        />
        <IconTile
          href="/institucional/projetos"
          rotulo="Programas e projetos"
          icone={<MappedIcon icone={ICONE_INSTITUCIONAL.projetos} className="size-6" />}
        />
        <IconTile
          href="/institucional/dirigentes"
          rotulo="Dirigentes"
          icone={<MappedIcon icone={ICONE_INSTITUCIONAL.dirigentes} className="size-6" />}
        />
        <IconTile
          href="/institucional/estrutura-organizacional"
          rotulo="Estrutura organizacional"
          icone={<MappedIcon icone={ICONE_INSTITUCIONAL.estrutura} className="size-6" />}
        />
      </div>
    </Container>
  );
}
