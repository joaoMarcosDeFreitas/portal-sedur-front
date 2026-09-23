import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConsultaView } from "@/app/components/organisms/ConsultaView";
import { getConsultaPorSlug, getConsultas } from "@/lib/data/consultas";

export async function generateStaticParams() {
  const consultas = await getConsultas("consulta");
  return consultas.map((consulta) => ({ slug: consulta.slug }));
}

export async function generateMetadata(props: PageProps<"/consultas/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const consulta = await getConsultaPorSlug("consulta", slug);
  return consulta ? { title: consulta.titulo, description: consulta.descricao } : {};
}

export default async function ConsultaPage(props: PageProps<"/consultas/[slug]">) {
  const [{ slug }, busca] = await Promise.all([props.params, props.searchParams]);
  const consulta = await getConsultaPorSlug("consulta", slug);
  if (!consulta) notFound();

  const valores = Object.fromEntries(
    consulta.campos.map((campo) => {
      const valor = busca[campo.id];
      return [campo.id, (Array.isArray(valor) ? valor[0] : valor) ?? ""];
    }),
  );

  return (
    <ConsultaView
      def={consulta}
      valores={valores}
      pagina={Number(typeof busca.pagina === "string" ? busca.pagina : "1") || 1}
      caminho={`/consultas/${consulta.slug}`}
      migalhas={[{ rotulo: "Consultas", href: "/consultas" }, { rotulo: consulta.titulo }]}
    />
  );
}
