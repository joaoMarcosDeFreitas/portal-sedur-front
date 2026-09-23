import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { CategoryListItem } from "@/app/components/molecules/CategoryListItem";
import { getCategorias } from "@/lib/data/servicos";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Todos os serviços da SEDUR reunidos por categoria: licenças, alvarás, consultas e autorizações.",
};

const RECURSOS = [
  { rotulo: "Consultas", descricao: "Alvarás, autos de infração e atividades permitidas.", href: "/consultas" },
  { rotulo: "Formulários", descricao: "Anexos e modelos de documentos em PDF.", href: "/formularios" },
  { rotulo: "Serviços dispensados de licença", descricao: "Obras simples que não precisam de licença.", href: "/servicos/dispensados-de-licenca" },
  { rotulo: "Geoserviços", descricao: "Dados geoespaciais oficiais da cidade.", href: "/geoservicos" },
  { rotulo: "Sistemas parceiros", descricao: "Agendamento, consulta prévia e outros sistemas.", href: "/sistemas-parceiros" },
  { rotulo: "Canais de atendimento", descricao: "WhatsApp, e-mail, atendimento presencial.", href: "/canais-de-atendimento" },
];

export default async function ServicosPage() {
  const categorias = await getCategorias();

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Serviços
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Escolha uma categoria ou use a busca acima para encontrar um serviço pelo nome.
      </Text>
      <div className="mt-8 flex flex-wrap gap-2">
        {categorias.map((categoria) => (
          <CategoryListItem key={categoria.id} categoria={categoria} />
        ))}
      </div>

      <Text as="h2" variant="h2" className="mt-16">
        Mais recursos
      </Text>
      <ul className="-mx-4 mt-4 grid max-w-4xl sm:grid-cols-2">
        {RECURSOS.map((recurso) => (
          <li key={recurso.href}>
            <Link href={recurso.href} className="group block cursor-pointer rounded-xl px-4 py-3 transition-colors hover:bg-surface-muted">
              <span className="block font-medium text-foreground group-hover:text-brand">{recurso.rotulo}</span>
              <span className="mt-0.5 block text-sm text-foreground-muted">{recurso.descricao}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
