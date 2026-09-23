import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { DetalheSolicitacao } from "@/app/components/organisms/DetalheSolicitacao";

export const metadata: Metadata = { title: "Acompanhar solicitação" };

// As solicitações vivem no navegador (mock), então esta rota é renderizada sob demanda.
export default async function SolicitacaoPage(props: PageProps<"/minhas-solicitacoes/[protocolo]">) {
  const { protocolo } = await props.params;

  return (
    <Container className="py-12">
      <DetalheSolicitacao protocolo={protocolo} />
    </Container>
  );
}
