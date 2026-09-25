import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calcularValorDam, exigeArea, formatarValor, parseValor } from "@/lib/solicitacoes/dam";
import {
  cancelarAgendamento,
  criarAgendamento,
  HORARIOS,
  horarioIndisponivel,
  proximosDiasUteis,
} from "@/lib/agendamento/store";
import type { Agendamento } from "@/types/agendamento";

describe("DAM", () => {
  const taxas = [
    { descricao: "Licença por m²", valor: "R$ 2,50" },
    { descricao: "Taxa de Expediente", valor: "R$ 24,21" },
  ];

  it("parseValor lê valores em real", () => {
    expect(parseValor("R$ 2.104,18")).toBe(2104.18);
    expect(parseValor("R$ 24,21")).toBe(24.21);
    expect(parseValor("sem número")).toBe(0);
  });

  it("formatarValor usa o formato brasileiro", () => {
    expect(formatarValor(2104.18).replace(/\s/g, " ")).toBe("R$ 2.104,18");
  });

  it("só pede a área quando alguma taxa é cobrada por m²", () => {
    expect(exigeArea(taxas)).toBe(true);
    expect(exigeArea([{ descricao: "Taxa de Expediente", valor: "R$ 24,21" }])).toBe(false);
  });

  it("taxa por m² multiplica pela área; a fixa entra uma vez", () => {
    expect(calcularValorDam(taxas, 100)).toBeCloseTo(2.5 * 100 + 24.21);
    expect(calcularValorDam(taxas, 0)).toBeCloseTo(24.21);
    expect(calcularValorDam(taxas, -50)).toBeCloseTo(24.21);
    expect(calcularValorDam([], 100)).toBe(0);
  });
});

describe("agendamento: horários e dias", () => {
  it("14 horários, de 09:00 a 15:30, de meia em meia hora", () => {
    expect(HORARIOS).toHaveLength(14);
    expect(HORARIOS[0]).toBe("09:00");
    expect(HORARIOS[1]).toBe("09:30");
    expect(HORARIOS.at(-1)).toBe("15:30");
  });

  it("os próximos dias úteis começam amanhã e pulam o fim de semana", () => {
    // sexta-feira 25/09/2026 -> o próximo dia útil é segunda 28/09
    const dias = proximosDiasUteis(15, new Date(2026, 8, 25));
    expect(dias).toHaveLength(15);
    expect(dias[0].valor).toBe("2026-09-28");
    expect(dias[0].rotulo).toMatch(/^Segunda-feira/);
    for (const dia of dias) {
      const [a, m, d] = dia.valor.split("-").map(Number);
      const semana = new Date(a, m - 1, d).getDay();
      expect(semana, dia.valor).not.toBe(0);
      expect(semana, dia.valor).not.toBe(6);
    }
    const valores = dias.map((d) => d.valor);
    expect([...valores].sort()).toEqual(valores);
    expect(new Set(valores).size).toBe(15);
  });

  it("no sábado, o primeiro dia disponível é a segunda", () => {
    expect(proximosDiasUteis(1, new Date(2026, 8, 26))[0].valor).toBe("2026-09-28");
  });

  it("atravessa a virada de ano corretamente", () => {
    const dias = proximosDiasUteis(3, new Date(2026, 11, 30)); // quarta 30/12
    expect(dias.map((d) => d.valor)).toEqual(["2026-12-31", "2027-01-01", "2027-01-04"]);
  });
});

describe("agendamento: disponibilidade simulada", () => {
  it("é determinística e ocupa cerca de 1 em cada 4 horários", () => {
    const dias = proximosDiasUteis(15, new Date(2026, 8, 25)).map((d) => d.valor);
    let ocupados = 0;
    let total = 0;
    for (const dia of dias) {
      for (const h of HORARIOS) {
        const a = horarioIndisponivel(dia, h, []);
        expect(horarioIndisponivel(dia, h, [])).toBe(a);
        ocupados += a ? 1 : 0;
        total += 1;
      }
    }
    expect(ocupados / total).toBeGreaterThan(0.15);
    expect(ocupados / total).toBeLessThan(0.35);
  });

  it("todo dia tem ao menos um horário livre", () => {
    for (const dia of proximosDiasUteis(15, new Date(2026, 8, 25))) {
      expect(HORARIOS.some((h) => !horarioIndisponivel(dia.valor, h, [])), dia.valor).toBe(true);
    }
  });

  it("o horário que a própria pessoa marcou fica indisponível; o cancelado volta a ficar livre", () => {
    const dia = "2026-09-28";
    const livre = HORARIOS.find((h) => !horarioIndisponivel(dia, h, []))!;
    const meu = (status: Agendamento["status"]): Agendamento => ({
      protocolo: "AGD-2026-000001", assunto: "Publicidade", data: dia, horario: livre, nome: "Fulano", contato: "", criadoEm: "", status,
    });
    expect(horarioIndisponivel(dia, livre, [meu("confirmado")])).toBe(true);
    expect(horarioIndisponivel(dia, livre, [meu("cancelado")])).toBe(false);
  });
});

describe("agendamento: criar e cancelar (localStorage simulado)", () => {
  const memoria = new Map<string, string>();

  beforeEach(() => {
    memoria.clear();
    vi.stubGlobal("localStorage", {
      getItem: (chave: string) => memoria.get(chave) ?? null,
      setItem: (chave: string, valor: string) => void memoria.set(chave, valor),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  const guardados = (): Agendamento[] => JSON.parse(memoria.get("portal-sedur:agendamentos") ?? "[]");

  it("gera protocolo AGD-aaaa-nnnnnn e guarda como confirmado", () => {
    const protocolo = criarAgendamento({ assunto: "Publicidade", data: "2026-09-28", horario: "09:30", nome: "Fulano", contato: "" });
    expect(protocolo).toMatch(/^AGD-\d{4}-\d{6}$/);
    const salvo = guardados().find((a) => a.protocolo === protocolo);
    expect(salvo).toMatchObject({ status: "confirmado", horario: "09:30", nome: "Fulano" });
  });

  it("cancelar muda só o agendamento certo", () => {
    const a = criarAgendamento({ assunto: "Urbanismo", data: "2026-09-29", horario: "10:00", nome: "A", contato: "" });
    const b = criarAgendamento({ assunto: "Eventos", data: "2026-09-30", horario: "11:00", nome: "B", contato: "" });
    cancelarAgendamento(a);
    const lista = guardados();
    expect(lista.find((x) => x.protocolo === a)?.status).toBe("cancelado");
    expect(lista.find((x) => x.protocolo === b)?.status).toBe("confirmado");
  });
});
