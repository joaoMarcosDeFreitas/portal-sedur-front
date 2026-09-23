import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { CategoryIcon } from "@/app/components/atoms/CategoryIcon";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { IconTile } from "@/app/components/molecules/IconTile";
import { getAreasDeAtuacao } from "@/lib/data/institucional";

export const metadata: Metadata = {
  title: "Áreas de atuação",
  description: "As sete áreas em que a SEDUR atua no licenciamento e na fiscalização da cidade.",
};

export default async function AreasPage() {
  const { introducao, areas } = await getAreasDeAtuacao();

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Institucional", href: "/institucional" }, { rotulo: "Áreas de atuação" }]} />
      <Text as="h1" variant="h1" className="mt-6">
        Áreas de atuação
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        {introducao}
      </Text>
      <div className="mt-10 flex flex-wrap gap-2">
        {areas.map((area) => (
          <IconTile
            key={area.slug}
            href={`/institucional/areas-de-atuacao/${area.slug}`}
            rotulo={area.titulo}
            icone={<CategoryIcon nome={area.categoria} className="size-6" />}
          />
        ))}
      </div>
    </Container>
  );
}
