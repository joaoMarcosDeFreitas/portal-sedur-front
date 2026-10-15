import { describe, expect, it } from "vitest";
import { getSistemaInterno, getSistemasInternos } from "@/lib/data/acesso-interno";

describe("acesso interno", () => {
  it("11 sistemas, na ordem da tela original, com slugs únicos", async () => {
    const sistemas = await getSistemasInternos();
    expect(sistemas.map((s) => s.nome)).toEqual([
      "Portal Sedur", "SIGS", "GLPI", "Revista SEDUR", "e-Salvador", "Alfresco", "SAPS", "Webmail", "SedurMap", "BI", "PDDU",
    ]);
    expect(new Set(sistemas.map((s) => s.slug)).size).toBe(11);
  });

  it("todo endereço é uma URL http(s) válida", async () => {
    for (const sistema of await getSistemasInternos()) {
      expect(["http:", "https:"], sistema.nome).toContain(new URL(sistema.url).protocol);
    }
  });

  it("quatro sistemas levam à página de aviso: Revista, SAPS, Webmail e SedurMap", async () => {
    const sem = (await getSistemasInternos()).filter((s) => !s.disponivel).map((s) => s.slug);
    expect(sem).toEqual(["revista-sedur", "saps", "webmail", "sedurmap"]);
  });

  it("busca por slug; inexistente devolve nada", async () => {
    expect((await getSistemaInterno("sigs"))?.nome).toBe("SIGS");
    expect(await getSistemaInterno("nao-existe")).toBeUndefined();
  });
});
