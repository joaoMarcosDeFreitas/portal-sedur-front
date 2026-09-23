import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { OrgNode } from "@/app/components/organisms/OrgTree";
import { getOrganograma } from "@/lib/data/institucional";

export const metadata: Metadata = {
  title: "Estrutura organizacional",
  description: "Organograma da Secretaria Municipal de Desenvolvimento Urbano de Salvador.",
};

function Grupo({ titulo, itens }: { titulo: string; itens: string[] }) {
  if (itens.length === 0) return null;
  return (
    <section>
      <Text as="h2" variant="h3">
        {titulo}
      </Text>
      <ul className="mt-3 flex flex-wrap gap-2">
        {itens.map((item) => (
          <li key={item} className="rounded-full bg-primary-600/10 px-3.5 py-1.5 text-sm text-brand">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function EstruturaPage() {
  const gabinete = await getOrganograma();

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Institucional", href: "/institucional" }, { rotulo: "Estrutura organizacional" }]} />
      <Text as="h1" variant="h1" className="mt-6">
        Estrutura organizacional
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Como a SEDUR se organiza, do Gabinete do Secretário às coordenadorias e setores. Baseado nas Leis nº
        9.186/2016 e Leis Complementares nº 076/2020 e nº 077/2021.
      </Text>

      <div className="mt-10 flex max-w-4xl flex-col gap-10">
        <Grupo titulo="Colegiados de deliberação superior" itens={gabinete.colegiados_de_deliberacao_superior} />
        <Grupo titulo="Administração indireta" itens={gabinete.administracao_indireta} />
        <Grupo titulo="Assessorias" itens={gabinete.assessorias} />

        <section>
          <Text as="h2" variant="h3">
            Unidades subordinadas ao Gabinete
          </Text>
          <ul className="mt-5 flex flex-col gap-6">
            {gabinete.subordinadas.map((unidade) => (
              <OrgNode key={unidade.nome} unidade={unidade} />
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
