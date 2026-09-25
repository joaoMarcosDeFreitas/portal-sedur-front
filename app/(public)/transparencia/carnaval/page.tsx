import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getConsultas } from "@/lib/data/consultas";

export const metadata: Metadata = {
  title: "Fiscalização Carnaval 2026",
  description: "Painéis de acompanhamento da fiscalização da SEDUR no Carnaval 2026.",
};

/** Painéis que o portal atual lista mas ainda não tem no ar (mostram "Em construção"). */
const EM_CONSTRUCAO = ["Exploração de Atividades", "Instalação de Praticável", "Instalação de Balcão"];

export default async function CarnavalPage() {
  const paineis = await getConsultas("carnaval");

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Transparência", href: "/transparencia" }, { rotulo: "Fiscalização Carnaval 2026" }]} />
      <Text as="h1" variant="h1" className="mt-6">
        Fiscalização Carnaval 2026
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Acompanhe o que a SEDUR licenciou e fiscalizou durante o Carnaval 2026, de 4 a 18 de fevereiro. Escolha um painel.
      </Text>

      <ul className="-mx-4 mt-8 flex max-w-3xl flex-col">
        {paineis.map((painel) => (
          <li key={painel.slug}>
            <Link
              href={`/transparencia/carnaval/${painel.slug}`}
              className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-4 transition-colors hover:bg-surface-muted"
            >
              <span>
                <span className="font-heading font-semibold text-foreground group-hover:text-brand">{painel.titulo}</span>
                <span className="mt-1 block text-sm text-foreground-muted">Alvarás emitidos, por data e circuito.</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-foreground-muted group-hover:text-brand" aria-hidden="true" />
            </Link>
          </li>
        ))}
        {EM_CONSTRUCAO.map((nome) => (
          <li key={nome} className="flex items-center justify-between gap-4 px-4 py-4">
            <span>
              <span className="font-heading font-semibold text-foreground">{nome}</span>
              <span className="mt-1 block text-sm text-foreground-muted">Este painel ainda está em construção.</span>
            </span>
            <Badge tone="warning">Em construção</Badge>
          </li>
        ))}
      </ul>
    </Container>
  );
}
