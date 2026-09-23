import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { MappedIcon } from "@/app/components/atoms/MappedIcon";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { IconTile } from "@/app/components/molecules/IconTile";
import { getProjetos } from "@/lib/data/institucional";
import { iconeDeProjeto } from "@/lib/ui/secoes-icons";

export const metadata: Metadata = {
  title: "Programas e projetos",
  description: "Programas e instrumentos de desenvolvimento urbano conduzidos pela SEDUR.",
};

export default async function ProjetosPage() {
  const projetos = await getProjetos();

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Institucional", href: "/institucional" }, { rotulo: "Programas e projetos" }]} />
      <Text as="h1" variant="h1" className="mt-6">
        Programas e projetos
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Escolha um programa para ver como funciona, a legislação e os serviços relacionados.
      </Text>
      <div className="mt-10 flex flex-wrap gap-2">
        {projetos.map((projeto) => (
          <IconTile
            key={projeto.slug}
            href={`/institucional/projetos/${projeto.slug}`}
            rotulo={projeto.nome}
            icone={<MappedIcon icone={iconeDeProjeto(projeto.slug)} className="size-6" />}
          />
        ))}
      </div>
    </Container>
  );
}
