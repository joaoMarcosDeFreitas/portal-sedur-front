import { notFound, redirect } from "next/navigation";
import { acoesDoServico, getServicoPorId, getTodosOsServicos, slugDaCategoria, slugDoServico } from "@/lib/data/servicos";

// Endereço antigo (`/solicitar/<id>`): agora cada ação tem o seu (`/emitir-dam` e `/abrir-processo`). Leva à
// primeira ação do serviço; se ele não tem nenhuma (15 serviços só informativos), volta para a ficha.
export const dynamicParams = false;

export async function generateStaticParams() {
  const servicos = await getTodosOsServicos();
  return servicos.map((servico) => ({ servicoId: servico.id }));
}

export default async function SolicitarRedireciona(props: PageProps<"/solicitar/[servicoId]">) {
  const { servicoId } = await props.params;
  const servico = await getServicoPorId(servicoId);
  if (!servico) notFound();

  const [primeira] = acoesDoServico(servico);
  if (primeira) redirect(primeira.href);
  redirect(`/servicos/${slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria })}/${slugDoServico(servico)}`);
}
