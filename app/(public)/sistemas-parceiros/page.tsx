import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";

export const metadata: Metadata = {
  title: "Sistemas parceiros",
  description: "Outros sistemas da Prefeitura de Salvador usados junto com os serviços da SEDUR.",
};

interface Sistema {
  nome: string;
  descricao: string;
  url: string;
  emManutencao?: boolean;
}

// Endereços e situação conforme levantamento de 21/09/2026 (reforma-portal/preparacao-mock).
// O Agendamento deixou de ser sistema à parte: agora é a página /agendamento deste portal.
const SISTEMAS: Sistema[] = [
  {
    nome: "Consulta Prévia Salvador",
    descricao: "Sistema da Prefeitura de Salvador para consultas prévias.",
    url: "https://consultaprevia.sedur.salvador.ba.gov.br",
  },
  {
    nome: "Revisão do PDDU",
    descricao: "Site da revisão do Plano Diretor: etapas, processo participativo, notícias, arquivos e ouvidoria.",
    url: "https://pddu.salvador.ba.gov.br/",
  },
  {
    nome: "Mapeamento Salvador (GIS)",
    descricao: "Mapas e dados geográficos da cidade.",
    url: "https://mapeamento.salvador.ba.gov.br",
  },
  {
    nome: "Autorização para Feira (CLE)",
    descricao: "Pedido digital de autorização para feiras e congressos.",
    url: "https://servicos.sedur.salvador.ba.gov.br/eventos/form.jsp?sys=CLE&formID=464570877",
    emManutencao: true,
  },
  {
    nome: "Salvador Ruas",
    descricao: "Sistema de ruas e logradouros da Prefeitura.",
    url: "https://ruas.salvador.ba.gov.br",
    emManutencao: true,
  },
];

export default function SistemasParceirosPage() {
  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Sistemas parceiros
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Alguns serviços dependem de sistemas mantidos por outras áreas da Prefeitura. Ao abrir um deles você sai deste
        portal e passa a usar o site de destino.
      </Text>

      <ul className="-mx-4 mt-8 flex max-w-3xl flex-col">
        {SISTEMAS.map((sistema) => (
          <li key={sistema.nome}>
            <a
              href={sistema.url}
              target="_blank"
              rel="noreferrer"
              className="group flex cursor-pointer items-start justify-between gap-4 rounded-xl px-4 py-4 transition-colors hover:bg-surface-muted"
            >
              <span>
                <span className="flex flex-wrap items-center gap-3">
                  <span className="font-heading font-semibold text-foreground group-hover:text-brand">{sistema.nome}</span>
                  {sistema.emManutencao && <Badge tone="warning">Em manutenção</Badge>}
                </span>
                <span className="mt-1 block text-sm text-foreground-muted">{sistema.descricao}</span>
              </span>
              <ExternalLink className="mt-1 size-4 shrink-0 text-foreground-muted group-hover:text-brand" aria-label="Abre em outro site" />
            </a>
          </li>
        ))}
      </ul>
    </Container>
  );
}
