import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { concluirSolicitacao, confirmarPagamento, criarSolicitacao } from "@/lib/solicitacoes/store";
import { rotuloDoStatus } from "@/lib/solicitacoes/status";
import type { Solicitacao } from "@/types/solicitacao";

describe("solicitações: emissão de DAM × abertura de processo", () => {
  const memoria = new Map<string, string>();

  beforeEach(() => {
    memoria.clear();
    vi.stubGlobal("localStorage", {
      getItem: (chave: string) => memoria.get(chave) ?? null,
      setItem: (chave: string, valor: string) => void memoria.set(chave, valor),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  const guardadas = (): Solicitacao[] => JSON.parse(memoria.get("portal-sedur:solicitacoes") ?? "[]");
  const achar = (protocolo: string) => guardadas().find((s) => s.protocolo === protocolo)!;

  const base = { servicoId: "6876", servicoNome: "Alteração de Razão Social", categoria: "Ambiental", requerente: "Maria" };

  it("emissão de DAM: protocolo DAM-…, DAM gerado, aguardando pagamento e SEM etapa de análise", () => {
    const protocolo = criarSolicitacao({ ...base, tipo: "dam", valorDam: 725.6 });
    expect(protocolo).toMatch(/^DAM-\d{4}-\d{6}$/);
    const s = achar(protocolo);
    expect(s).toMatchObject({ tipo: "dam", status: "aguardando_pagamento" });
    expect(s.dam?.valor).toBe(725.6);
    expect(s.dam?.codigo).toMatch(/^\d{11} \d{11} \d{11} \d{11}$/);
    expect(s.imovel).toBe("");
  });

  it("pagar o DAM encerra o pedido: 'Pago', com comprovante (não vira análise)", () => {
    const protocolo = criarSolicitacao({ ...base, tipo: "dam", valorDam: 100 });
    confirmarPagamento(protocolo);
    const s = achar(protocolo);
    expect(s.status).toBe("concluida");
    expect(s.dam?.pagoEm).toBeTruthy();
    expect(rotuloDoStatus(s)).toBe("Pago");
    expect(s.historico.map((h) => h.titulo)).toContain("DAM pago — comprovante disponível");
    expect(s.historico.map((h) => h.titulo)).not.toContain("Solicitação em análise");
  });

  it("pagar duas vezes não muda nada", () => {
    const protocolo = criarSolicitacao({ ...base, tipo: "dam", valorDam: 100 });
    confirmarPagamento(protocolo);
    const primeira = achar(protocolo).dam?.pagoEm;
    confirmarPagamento(protocolo);
    expect(achar(protocolo).dam?.pagoEm).toBe(primeira);
    expect(achar(protocolo).historico).toHaveLength(3);
  });

  it("abertura de processo: protocolo SEDUR-…, sem DAM, direto para análise", () => {
    const protocolo = criarSolicitacao({
      ...base, tipo: "processo", imovel: "Rua A, 1", bairro: "Pituba", descricao: "poda", documentosAnexados: ["Requerimento"], valorDam: 999,
    });
    expect(protocolo).toMatch(/^SEDUR-\d{4}-\d{6}$/);
    const s = achar(protocolo);
    expect(s).toMatchObject({ tipo: "processo", status: "em_analise", imovel: "Rua A, 1" });
    expect(s.dam, "processo não gera DAM, mesmo que se passe um valor").toBeUndefined();
    expect(rotuloDoStatus(s)).toBe("Em análise");
  });

  it("processo em análise pode ser concluído (demonstração); DAM pago não", () => {
    const processo = criarSolicitacao({ ...base, tipo: "processo", imovel: "x", bairro: "y" });
    concluirSolicitacao(processo);
    expect(achar(processo).status).toBe("concluida");
    expect(rotuloDoStatus(achar(processo))).toBe("Concluída");

    const dam = criarSolicitacao({ ...base, tipo: "dam", valorDam: 50 });
    concluirSolicitacao(dam); // ainda aguardando pagamento: não conclui
    expect(achar(dam).status).toBe("aguardando_pagamento");
  });

  it("solicitação antiga (sem tipo) mantém o fluxo combinado: pagar leva à análise", async () => {
    const antiga: Solicitacao = {
      protocolo: "SEDUR-2025-000001", servicoId: "1", servicoNome: "X", categoria: "Y", criadaEm: "2025-01-01T00:00:00.000Z",
      requerente: "Z", imovel: "i", bairro: "b", descricao: "", documentosAnexados: [],
      dam: { codigo: "1", valor: 10, vencimento: "2025-01-11T00:00:00.000Z" }, status: "aguardando_pagamento", historico: [],
    };
    memoria.set("portal-sedur:solicitacoes", JSON.stringify([antiga]));
    // O store lê o localStorage só no 1º acesso: importa uma cópia nova do módulo para ele ler o dado antigo.
    vi.resetModules();
    const novo = await import("@/lib/solicitacoes/store");
    novo.confirmarPagamento("SEDUR-2025-000001");
    const depois = guardadas().find((s) => s.protocolo === "SEDUR-2025-000001")!;
    expect(depois.status).toBe("em_analise");
    expect(depois.dam?.pagoEm).toBeTruthy();
    expect(rotuloDoStatus(depois)).toBe("Em análise");
  });
});
