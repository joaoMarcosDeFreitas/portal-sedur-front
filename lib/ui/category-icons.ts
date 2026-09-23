import {
  Antenna,
  Building2,
  CalendarDays,
  HardHat,
  Landmark,
  Leaf,
  Map,
  MapPin,
  Megaphone,
  Music4,
  PartyPopper,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Ícone por categoria de serviço (nome exatamente como vem em servicos.json). */
const ICONE_POR_CATEGORIA: Record<string, LucideIcon> = {
  Ambiental: Leaf,
  Auxiliares: Wrench,
  Carnaval: PartyPopper,
  "Desenvolvimento Econômico": TrendingUp,
  Empreendimento: Building2,
  Eventos: CalendarDays,
  "Festas Populares": Music4,
  "Obras Especiais": HardHat,
  "Parcelamento do Solo": Map,
  Publicidade: Megaphone,
  Telecomunicações: Antenna,
  Urbanismo: Landmark,
  "Viabilidade de Localização": MapPin,
};

export function iconeDaCategoria(nomeCategoria: string): LucideIcon {
  return ICONE_POR_CATEGORIA[nomeCategoria] ?? Building2;
}
