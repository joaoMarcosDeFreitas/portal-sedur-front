import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { LinkButton } from "@/app/components/atoms/Button";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getSistemaInterno, getSistemasInternos } from "@/lib/data/acesso-interno";

// Só os sistemas sem link funcionando têm esta página de aviso; qualquer outro endereço é 404 já no servidor.
export const dynamicParams = false;

export async function generateStaticParams() {
  const sistemas = await getSistemasInternos();
  return sistemas.filter((sistema) => !sistema.disponivel).map((sistema) => ({ sistema: sistema.slug }));
}

export async function generateMetadata(props: PageProps<"/acesso-interno/[sistema]">): Promise<Metadata> {
  const { sistema: slug } = await props.params;
  const sistema = await getSistemaInterno(slug);
  return sistema ? { title: `${sistema.nome} — link não abriu` } : {};
}

export default async function SistemaIndisponivelPage(props: PageProps<"/acesso-interno/[sistema]">) {
  const { sistema: slug } = await props.params;
  const sistema = await getSistemaInterno(slug);
  if (!sistema || sistema.disponivel) notFound();

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Acesso interno", href: "/acesso-interno" }, { rotulo: sistema.nome }]} />
      <div className="mt-6 max-w-2xl">
        <Text as="p" variant="eyebrow" tone="accent">
          {sistema.nome}
        </Text>
        <Text as="h1" variant="h1" className="mt-3">
          Este link não levou a nenhuma página
        </Text>
        <div role="note" className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-surface-muted p-5">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
          <div className="flex flex-col gap-3">
            <Text>
              Durante a produção deste site (uma versão de demonstração), ao clicar em <strong>{sistema.nome}</strong> a
              partir de um computador pessoal, o endereço cadastrado não abriu página alguma.
            </Text>
            <Text tone="muted" variant="small">
              O sistema pode estar fora do ar, ter mudado de endereço ou só responder dentro da rede da SEDUR. Quando o
              portal for ligado aos sistemas reais, este item deve apontar para o endereço correto.
            </Text>
            <Text variant="small" tone="muted">
              Endereço cadastrado: <span className="break-all">{sistema.url}</span>
            </Text>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/acesso-interno">Voltar ao Acesso interno</LinkButton>
          <LinkButton href="/" variant="secondary">
            Ir para a página inicial
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
