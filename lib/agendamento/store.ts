import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/store/local-store";
import type { Agendamento } from "@/types/agendamento";

const VAZIO: Agendamento[] = [];
const store = createLocalStore<Agendamento[]>("portal-sedur:agendamentos", VAZIO);

export function useAgendamentos(): Agendamento[] {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

/**
 * Horários de atendimento: o sistema atual informa "entre 9:00h às 15:30h". Aqui, de meia em meia
 * hora (14 horários por dia).
 */
export const HORARIOS = Array.from({ length: 14 }, (_, i) => {
  const minutos = 9 * 60 + i * 30;
  return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
});

/** aaaa-mm-dd no fuso local (toISOString usaria UTC e poderia cair no dia errado). */
function chaveDoDia(dia: Date): string {
  const mes = String(dia.getMonth() + 1).padStart(2, "0");
  const numero = String(dia.getDate()).padStart(2, "0");
  return `${dia.getFullYear()}-${mes}-${numero}`;
}

export interface DiaDisponivel {
  valor: string;
  rotulo: string;
}

/** Os próximos dias úteis a partir de amanhã (sábado e domingo ficam de fora). Feriados não são considerados. */
export function proximosDiasUteis(quantidade: number, hoje = new Date()): DiaDisponivel[] {
  const formato = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  const dias: DiaDisponivel[] = [];
  const dia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  while (dias.length < quantidade) {
    dia.setDate(dia.getDate() + 1);
    if (dia.getDay() === 0 || dia.getDay() === 6) continue;
    const texto = formato.format(dia);
    dias.push({ valor: chaveDoDia(dia), rotulo: texto.charAt(0).toUpperCase() + texto.slice(1) });
  }
  return dias;
}

/**
 * Simula horários já ocupados (cerca de 1 em cada 4), sempre os mesmos para o mesmo dia e horário,
 * mais os que a própria pessoa já marcou neste navegador.
 */
export function horarioIndisponivel(data: string, horario: string, agendados: Agendamento[]): boolean {
  let hash = 0;
  for (const c of `${data}${horario}`) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  const ocupado = hash % 4 === 0;
  const meu = agendados.some((a) => a.status === "confirmado" && a.data === data && a.horario === horario);
  return ocupado || meu;
}

function digitos(quantidade: number) {
  return Array.from({ length: quantidade }, () => Math.floor(Math.random() * 10)).join("");
}

export type NovoAgendamento = Pick<Agendamento, "assunto" | "data" | "horario" | "nome" | "contato">;

/** Confirma o agendamento e devolve o protocolo (AGD-aaaa-nnnnnn). */
export function criarAgendamento(novo: NovoAgendamento): string {
  const protocolo = `AGD-${new Date().getFullYear()}-${digitos(6)}`;
  const agendamento: Agendamento = { ...novo, protocolo, criadoEm: new Date().toISOString(), status: "confirmado" };
  store.set([agendamento, ...store.getSnapshot()]);
  return protocolo;
}

export function cancelarAgendamento(protocolo: string) {
  store.set(store.getSnapshot().map((a) => (a.protocolo === protocolo ? { ...a, status: "cancelado" as const } : a)));
}
