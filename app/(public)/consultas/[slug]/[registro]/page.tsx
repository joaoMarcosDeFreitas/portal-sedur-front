import type { Metadata } from "next";
import { NaoEncontrado } from "@/app/components/organisms/NaoEncontrado";
import { DetalheConsultaView } from "@/app/components/organisms/DetalheConsultaView";
import { detalheDe, getRegistro } from "@/lib/data/consultas";

export async function generateMetadata(props: PageProps<"/consultas/[slug]/[registro]">): Promise<Metadata> {
  const { slug, registro } = await props.params;
  const achado = await getRegistro("consulta", slug, registro);
  return achado ? { title: `${detalheDe(achado.def).titulo(achado.linha)} — ${achado.def.titulo}` } : { title: "Página não encontrada", robots: { index: false } };
}

export default async function DetalheConsultaPage(props: PageProps<"/consultas/[slug]/[registro]">) {
  const { slug, registro } = await props.params;
  const achado = await getRegistro("consulta", slug, registro);
  // Sem notFound(): esta página lê os filtros da URL (renderiza a cada visita) e, nesse caso, o Next entrega a 404
  // como esqueleto vazio que só se completa com JavaScript. Mostrando a tela aqui, ela já vem pronta do servidor.
  if (!achado) return <NaoEncontrado />;
  const { def, linha } = achado;

  return (
    <DetalheConsultaView
      def={def}
      linha={linha}
      migalhas={[
        { rotulo: "Consultas", href: "/consultas" },
        { rotulo: def.titulo, href: `/consultas/${def.slug}` },
        { rotulo: detalheDe(def).titulo(linha) },
      ]}
    />
  );
}
