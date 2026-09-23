import {
  Compass,
  Building2,
  FileSignature,
  Flag,
  HeartPulse,
  Landmark,
  ListChecks,
  Map,
  Receipt,
  Scale,
  ScrollText,
  Signpost,
  Stamp,
  Users,
  BadgeAlert,
  BookOpenText,
  FileCheck2,
  Megaphone,
  Table2,
  type LucideIcon,
} from "lucide-react";

/** Ícone de cada tipo de norma (id da seção em legislacao.json). */
const ICONE_POR_SECAO: Record<string, LucideIcon> = {
  cnlu: Users,
  "covid-19": HeartPulse,
  decretos: ScrollText,
  "denominacao-de-logradouros": Signpost,
  desapropriacao: Building2,
  editais: FileSignature,
  "instrucoes-normativas": ListChecks,
  leis: Scale,
  "louos-2016": Map,
  "bens-tombados": Landmark,
  "pddu-2016": Compass,
  "plano-salvador-500": Flag,
  portarias: Stamp,
  "taxas-multas": Receipt,
};

export function iconeDaSecao(idSecao: string): LucideIcon {
  return ICONE_POR_SECAO[idSecao] ?? BookOpenText;
}

/** Ícone de um subtipo (Comunicados, Resoluções...); sem correspondência, usa o do tipo. */
const ICONE_POR_SUBSECAO: Record<string, LucideIcon> = {
  comunicados: Megaphone,
  resolucoes: FileCheck2,
  "desapropriacao-municipal": Building2,
  "desapropriacao-estadual": Landmark,
  louos: BookOpenText,
  "louos-mapas": Map,
  "louos-quadros": Table2,
  "leis-pddu": Scale,
  "mapas-pddu": Map,
  "tabela-de-taxas": Receipt,
  "tabela-de-multas": BadgeAlert,
};

export function iconeDaSubsecao(idSubsecao: string, idSecao: string): LucideIcon {
  return ICONE_POR_SUBSECAO[idSubsecao] ?? iconeDaSecao(idSecao);
}
