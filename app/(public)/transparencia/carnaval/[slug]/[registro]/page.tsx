import type { Metadata } from "next";
import { NaoEncontrado } from "@/app/components/organisms/NaoEncontrado";
import { DetalheConsultaView } from "@/app/components/organisms/DetalheConsultaView";
import { detalheDe, getRegistro } from "@/lib/data/consultas";

export async function generateMetadata(props: PageProps<"/transparencia/carnaval/[slug]/[registro]">): Promise<Metadata> {
  const { slug, registro } = await props.params;
  const achado = await getRegistro("carnaval", slug, registro);
  return achado ? { title: `${detalheDe(achado.def).titulo(achado.linha)} — ${achado.def.titulo}` } : { title: "Página não encontrada", robots: { index: false } };
}

export default async function DetalheCarnavalPage(props: PageProps<"/transparencia/carnaval/[slug]/[registro]">) {
  const { slug, registro } = await props.params;
  const achado = await getRegistro("carnaval", slug, registro);
  // Sem notFound(): esta página lê os filtros da URL (renderiza a cada visita) e, nesse caso, o Next entrega a 404
  // como esqueleto vazio que só se completa com JavaScript. Mostrando a tela aqui, ela já vem pronta do servidor.
  if (!achado) return <NaoEncontrado />;
  const { def, linha } = achado;

  return (
    <DetalheConsultaView
      def={def}
      linha={linha}
      migalhas={[
        { rotulo: "Transparência", href: "/transparencia" },
        { rotulo: "Fiscalização Carnaval 2026", href: "/transparencia/carnaval" },
        { rotulo: def.titulo, href: `/transparencia/carnaval/${def.slug}` },
        { rotulo: detalheDe(def).titulo(linha) },
      ]}
    />
  );
}
