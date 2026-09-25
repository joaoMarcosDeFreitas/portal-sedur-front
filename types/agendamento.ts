export type StatusAgendamento = "confirmado" | "cancelado";

/** Um atendimento presencial agendado na SEDUR (demonstração, guardado só no navegador). */
export interface Agendamento {
  protocolo: string;
  assunto: string;
  /** Dia do atendimento, no formato aaaa-mm-dd. */
  data: string;
  /** Horário, no formato hh:mm (de 09:00 a 15:30, de meia em meia hora). */
  horario: string;
  nome: string;
  /** Telefone ou e-mail para lembrete (opcional). */
  contato: string;
  criadoEm: string;
  status: StatusAgendamento;
}
