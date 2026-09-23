import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getItensDeTransparenciaDoSite } from "@/lib/data/transparencia";

export const metadata: Metadata = {
  title: "Audiências públicas",
  description: "Editais e documentos das audiências públicas realizadas pela SEDUR.",
};

export default async function AudienciasPage() {
  const itens = await getItensDeTransparenciaDoSite();
  const audiencias = itens.find((item) => item.itens)?.itens ?? [];

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Transparência", href: "/transparencia" }, { rotulo: "Audiências públicas" }]} />
      <Text as="h1" variant="h1" className="mt-6">
        Audiências públicas
      </Text>

      {audiencias.length === 0 ? (
        <Text tone="muted" className="mt-6">
          Nenhuma audiência pública publicada no momento.
        </Text>
      ) : (
        <ul className="mt-8 flex max-w-3xl flex-col gap-8">
          {audiencias.map((audiencia) => (
            <li key={audiencia.numero}>
              <p className="font-heading font-semibold text-foreground">{audiencia.numero}</p>
              <p className="mt-0.5 text-xs text-foreground-muted">{audiencia.data}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{audiencia.descricao}</p>
              {audiencia.arquivo && (
                <a
                  href={audiencia.arquivo}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-brand hover:underline"
                >
                  <Download className="size-4" aria-hidden="true" /> Baixar edital
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
