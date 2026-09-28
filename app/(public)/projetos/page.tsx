import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { ProjetoTile } from "@/app/components/molecules/ProjetoTile";
import { getProjetos } from "@/lib/data/institucional";

export const metadata: Metadata = {
  title: "Nossos Projetos",
  description: "Programas e instrumentos de desenvolvimento urbano conduzidos pela SEDUR.",
};

export default async function ProjetosPage() {
  const projetos = await getProjetos();

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Nossos Projetos
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Escolha um programa para ver como funciona, a legislação e os serviços relacionados.
      </Text>
      <div className="mt-10 flex flex-wrap gap-2">
        {projetos.map((projeto) => (
          <ProjetoTile key={projeto.slug} slug={projeto.slug} nome={projeto.nome} imagem={projeto.imagem} />
        ))}
      </div>
    </Container>
  );
}
