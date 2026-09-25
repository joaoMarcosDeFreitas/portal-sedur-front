import type { Metadata } from "next";
import { NaoEncontrado } from "@/app/components/organisms/NaoEncontrado";
import { ConsultaView } from "@/app/components/organisms/ConsultaView";
import { getConsultaPorSlug, getConsultas } from "@/lib/data/consultas";

export async function generateStaticParams() {
  const paineis = await getConsultas("transparencia");
  return paineis.map((painel) => ({ slug: painel.slug }));
}

export async function generateMetadata(props: PageProps<"/transparencia/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const painel = await getConsultaPorSlug("transparencia", slug);
  return painel ? { title: painel.titulo, description: painel.descricao } : { title: "Página não encontrada", robots: { index: false } };
}

export default async function PainelPage(props: PageProps<"/transparencia/[slug]">) {
  const [{ slug }, busca] = await Promise.all([props.params, props.searchParams]);
  const painel = await getConsultaPorSlug("transparencia", slug);
  // Sem notFound(): esta página lê os filtros da URL (renderiza a cada visita) e, nesse caso, o Next entrega a 404
  // como esqueleto vazio que só se completa com JavaScript. Mostrando a tela aqui, ela já vem pronta do servidor.
  if (!painel) return <NaoEncontrado />;

  const valores = Object.fromEntries(
    painel.campos.map((campo) => {
      const valor = busca[campo.id];
      return [campo.id, (Array.isArray(valor) ? valor[0] : valor) ?? ""];
    }),
  );

  return (
    <ConsultaView
      def={painel}
      valores={valores}
      pagina={Number(typeof busca.pagina === "string" ? busca.pagina : "1") || 1}
      caminho={`/transparencia/${painel.slug}`}
      migalhas={[{ rotulo: "Transparência", href: "/transparencia" }, { rotulo: painel.titulo }]}
    />
  );
}
