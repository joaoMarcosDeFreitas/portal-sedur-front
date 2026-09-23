import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { LicitacoesLista } from "@/app/components/organisms/LicitacoesLista";
import { getEntradasDeLicitacoes } from "@/lib/data/licitacoes";

export const metadata: Metadata = {
  title: "Licitações",
  description: "Editais, avisos e retificações de licitações e contratações da SEDUR.",
};

export default async function LicitacoesPage() {
  const entradas = await getEntradasDeLicitacoes();

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Licitações
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Editais, avisos e retificações reunidos por processo. Filtre por modalidade ou ano.
      </Text>
      <div className="mt-8">
        <LicitacoesLista entradas={entradas} />
      </div>
    </Container>
  );
}
