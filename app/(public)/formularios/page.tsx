import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { FormulariosLista } from "@/app/components/organisms/FormulariosLista";
import { getFormularios } from "@/lib/data/formularios";

export const metadata: Metadata = {
  title: "Formulários",
  description: "Formulários e modelos de documentos exigidos nos serviços da SEDUR, com busca.",
};

export default async function FormulariosPage() {
  const formularios = await getFormularios();

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Formulários
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Anexos, modelos e declarações pedidos nos processos. Busque pelo nome do documento.
      </Text>
      <div className="mt-8">
        <FormulariosLista formularios={formularios} />
      </div>
    </Container>
  );
}
