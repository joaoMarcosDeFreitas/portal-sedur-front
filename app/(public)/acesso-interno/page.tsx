import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BadgeCheck,
  ChartColumn,
  ExternalLink,
  FolderOpen,
  LayoutDashboard,
  Mail,
  MapPinned,
  Megaphone,
  Monitor,
  MousePointerClick,
  ScrollText,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getSistemasInternos } from "@/lib/data/acesso-interno";

export const metadata: Metadata = {
  title: "Acesso interno",
  description: "Sistemas internos da SEDUR, para servidores com usuário e senha da Rede SEDUR.",
};

const ICONE = "size-9";

// Ícones por sistema (elementos prontos, não componentes escolhidos em tempo de render).
const ICONES: Record<string, ReactNode> = {
  "portal-sedur": <Monitor className={ICONE} aria-hidden="true" />,
  sigs: <LayoutDashboard className={ICONE} aria-hidden="true" />,
  glpi: <Wrench className={ICONE} aria-hidden="true" />,
  "revista-sedur": <Megaphone className={ICONE} aria-hidden="true" />,
  "e-salvador": <BadgeCheck className={ICONE} aria-hidden="true" />,
  alfresco: <FolderOpen className={ICONE} aria-hidden="true" />,
  saps: <MousePointerClick className={ICONE} aria-hidden="true" />,
  webmail: <Mail className={ICONE} aria-hidden="true" />,
  sedurmap: <MapPinned className={ICONE} aria-hidden="true" />,
  bi: <ChartColumn className={ICONE} aria-hidden="true" />,
  pddu: <ScrollText className={ICONE} aria-hidden="true" />,
};

const CARTAO =
  "group flex h-full min-h-40 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface px-4 py-6 text-center transition-colors hover:bg-surface-muted";

function Conteudo({ nome, icone, externo = false }: { nome: string; icone: ReactNode; externo?: boolean }) {
  return (
    <>
      <span className="flex size-16 items-center justify-center rounded-full bg-primary-600/10 text-brand transition-colors group-hover:bg-primary-600/15">
        {icone}
      </span>
      <span className="flex items-center gap-1.5 font-heading text-base font-semibold text-foreground group-hover:text-brand">
        {nome}
        {externo && (
          <>
            <ExternalLink className="size-3.5 text-foreground-muted" aria-hidden="true" />
            <span className="sr-only"> (abre em outro site)</span>
          </>
        )}
      </span>
    </>
  );
}

export default async function AcessoInternoPage() {
  const sistemas = await getSistemasInternos();

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Acesso interno" }]} />
      <div className="mt-6 max-w-3xl">
        <Text as="h1" variant="h1">
          Acesso interno
        </Text>
        <Text tone="muted" className="mt-3">
          Área para servidores da SEDUR. Cada sistema abre em outro site e pede o usuário e a senha da Rede SEDUR; quem
          não tem acesso deve procurar a Coordenação de Tecnologia da Informação.
        </Text>
        <p className="mt-4 flex items-start gap-2 text-sm text-foreground-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
          <span>Se você é cidadão, os serviços ao público estão em Serviços, no menu ao lado.</span>
        </p>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sistemas.map((sistema) => (
          <li key={sistema.slug}>
            {sistema.disponivel ? (
              <a href={sistema.url} target="_blank" rel="noreferrer" className={CARTAO}>
                <Conteudo nome={sistema.nome} icone={ICONES[sistema.slug]} externo />
              </a>
            ) : (
              <Link href={`/acesso-interno/${sistema.slug}`} className={CARTAO}>
                <Conteudo nome={sistema.nome} icone={ICONES[sistema.slug]} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Container>
  );
}
