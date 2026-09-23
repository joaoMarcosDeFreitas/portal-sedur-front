import {
  BadgePercent,
  Building2,
  CalendarDays,
  CalendarRange,
  FileDown,
  FileSearch,
  FileStack,
  FolderKanban,
  FolderOpen,
  Footprints,
  HardHat,
  KeyRound,
  Lightbulb,
  Mic,
  Network,
  Paintbrush,
  ShieldPlus,
  Target,
  TrainFront,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Ícones de Transparência: painéis (por slug) e as duas páginas de documentos. */
const ICONE_TRANSPARENCIA: Record<string, LucideIcon> = {
  "alvara-de-obras-em-vias-e-logradouros": HardHat,
  "alvaras-de-construcao-por-mes": CalendarRange,
  "alvaras-de-habite-se": KeyRound,
  "analise-de-orientacao-previa-aop": FileSearch,
  "estudo-de-impacto-de-vizinhanca-eiv": Building2,
  "eventos-licenciados": CalendarDays,
  "processos-em-convite": FolderOpen,
  "acoes-fiscais-covid": ShieldPlus,
  "audiencias-publicas": Mic,
  "eiv-riv": FileStack,
};

export function iconeDeTransparencia(chave: string): LucideIcon {
  return ICONE_TRANSPARENCIA[chave] ?? FileDown;
}

/** Ícones dos programas e projetos (slug em projetos.json). */
const ICONE_PROJETO: Record<string, LucideIcon> = {
  "plano-de-incentivos-fiscais": BadgePercent,
  "eu-curto-meu-passeio": Footprints,
  "conselho-municipal-salvador": Users,
  tul: TrainFront,
  revitalizar: Paintbrush,
  pidi: Lightbulb,
};

export function iconeDeProjeto(slug: string): LucideIcon {
  return ICONE_PROJETO[slug] ?? FolderKanban;
}

/** Ícones das quatro portas de entrada da página Institucional. */
export const ICONE_INSTITUCIONAL = {
  areas: Target,
  projetos: FolderKanban,
  dirigentes: UserRound,
  estrutura: Network,
} satisfies Record<string, LucideIcon>;
