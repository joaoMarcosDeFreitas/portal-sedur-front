import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConsultaView } from "@/app/components/organisms/ConsultaView";
import { getConsultaPorSlug, getConsultas } from "@/lib/data/consultas";

export async function generateStaticParams() {
  const paineis = await getConsultas("transparencia");
  return paineis.map((painel) => ({ slug: painel.slug }));
}

export async function generateMetadata(props: PageProps<"/transparencia/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const painel = await getConsultaPorSlug("transparencia", slug);
  return painel ? { title: painel.titulo, description: painel.descricao } : {};
}

export default async function PainelPage(props: PageProps<"/transparencia/[slug]">) {
  const [{ slug }, busca] = await Promise.all([props.params, props.searchParams]);
  const painel = await getConsultaPorSlug("transparencia", slug);
  if (!painel) notFound();

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
