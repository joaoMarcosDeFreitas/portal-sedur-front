import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { ListaSolicitacoes } from "@/app/components/organisms/ListaSolicitacoes";

export const metadata: Metadata = { title: "Minhas solicitações" };

export default function MinhasSolicitacoesPage() {
  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Minhas solicitações
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Acompanhe o andamento dos serviços que você solicitou.
      </Text>
      <div className="mt-8">
        <ListaSolicitacoes />
      </div>
    </Container>
  );
}
