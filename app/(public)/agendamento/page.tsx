import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { AgendamentoView } from "@/app/components/organisms/AgendamentoView";
import { getCategorias } from "@/lib/data/servicos";

export const metadata: Metadata = {
  title: "Agendamento de atendimento",
  description: "Marque o atendimento presencial na SEDUR: escolha o assunto, o dia e o horário.",
};

export default async function AgendamentoPage() {
  const categorias = await getCategorias();

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Serviços", href: "/servicos" }, { rotulo: "Agendamento de atendimento" }]} />
      <Text as="h1" variant="h1" className="mt-6">
        Agendamento de atendimento
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        O atendimento presencial na SEDUR é feito mediante agendamento. Escolha o assunto, o dia e o horário, de segunda
        a sexta, das 9h às 15h30, na Av. ACM, nº 3224, Caminho das Árvores.
      </Text>
      <p className="mt-3 max-w-2xl text-xs text-foreground-muted">
        Demonstração: os agendamentos ficam guardados apenas neste navegador e nada é enviado à SEDUR.
      </p>

      <AgendamentoView assuntos={categorias.map((categoria) => categoria.nome)} />
    </Container>
  );
}
