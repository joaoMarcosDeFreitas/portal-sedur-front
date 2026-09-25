import type { Metadata } from "next";
import { CalendarClock, Eye, FileText, Headset, Layers, Map, SearchCheck, Share2 } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { LinkButton } from "@/app/components/atoms/Button";
import { IconTile } from "@/app/components/molecules/IconTile";
import { CategoryListItem } from "@/app/components/molecules/CategoryListItem";
import { NewsCard } from "@/app/components/molecules/NewsCard";
import { getCategorias } from "@/lib/data/servicos";
import { buscarNoticias } from "@/lib/data/noticias";

export const metadata: Metadata = {
  title: {
    absolute: "Portal SEDUR — Serviços, legislação e desenvolvimento urbano de Salvador",
  },
  description:
    "Solicite serviços, consulte legislação, notícias e licitações da Secretaria Municipal de Desenvolvimento Urbano de Salvador em um único lugar.",
};

export default async function HomePage() {
  const [categorias, { itens: noticias }] = await Promise.all([getCategorias(), buscarNoticias({ porPagina: 3 })]);

  return (
    <>
      <section>
        <Container className="py-16 sm:py-20">
          <Text as="p" variant="eyebrow" tone="accent">
            Secretaria Municipal de Desenvolvimento Urbano
          </Text>
          <Text as="h1" variant="display" className="mt-3 max-w-2xl">
            Um só portal para os serviços de urbanismo de Salvador
          </Text>
          <Text tone="muted" className="mt-4 max-w-xl">
            Abra solicitações, acompanhe processos e consulte legislação, notícias e licitações da
            SEDUR — tudo em um único lugar, sem precisar trocar de sistema.
          </Text>
          <div className="mt-8">
            <LinkButton href="/servicos" size="lg">
              Ver serviços
            </LinkButton>
          </div>
        </Container>
      </section>

      <section>
        <Container className="pb-14">
          {/* O que o portal atual põe na página inicial: agendamento, consultas, formulários, geoserviços, transparência, canais e os sistemas parceiros. */}
          <Text as="h2" variant="h2">
            Acessos rápidos
          </Text>
          <div className="mt-6 flex flex-wrap gap-2">
            <IconTile href="/agendamento" rotulo="Agendamento de atendimento" icone={<CalendarClock className="size-6" />} />
            <IconTile href="/consultas" rotulo="Consultas" icone={<SearchCheck className="size-6" />} />
            <IconTile href="/formularios" rotulo="Formulários" icone={<FileText className="size-6" />} />
            <IconTile href="/geoservicos" rotulo="Geoserviços" icone={<Layers className="size-6" />} />
            <IconTile href="/transparencia" rotulo="Transparência" icone={<Eye className="size-6" />} />
            <IconTile href="/canais-de-atendimento" rotulo="Canais de atendimento" icone={<Headset className="size-6" />} />
            <IconTile href="/institucional/projetos/revisao-do-pddu" rotulo="Revisão do PDDU" icone={<Map className="size-6" />} />
            <IconTile href="/sistemas-parceiros" rotulo="Sistemas parceiros" icone={<Share2 className="size-6" />} />
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface-muted">
        <Container className="py-14">
          <Text as="h2" variant="h2">
            Categorias de serviço
          </Text>
          <div className="mt-6 flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <CategoryListItem key={categoria.id} categoria={categoria} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-14">
          <div className="flex items-end justify-between gap-4">
            <Text as="h2" variant="h2">
              Notícias
            </Text>
            <LinkButton href="/noticias" variant="ghost" size="sm">
              Ver todas
            </LinkButton>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {noticias.map((noticia) => (
              <NewsCard key={noticia.id} noticia={noticia} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
