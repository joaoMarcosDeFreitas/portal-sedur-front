import { describe, expect, it } from "vitest";
import {
  detalheDe,
  filtrarLinhas,
  getConsultaPorSlug,
  getConsultas,
  getRegistro,
  tomDaSituacao,
  tomDoRisco,
  type ConsultaDef,
} from "@/lib/data/consultas";

async function def(grupo: "consulta" | "transparencia" | "carnaval", slug: string): Promise<ConsultaDef> {
  const achada = await getConsultaPorSlug(grupo, slug);
  if (!achada) throw new Error(`consulta não existe: ${slug}`);
  return achada;
}

describe("catálogo das consultas", () => {
  it("tem 8 consultas, 7 painéis de transparência e o painel do Carnaval", async () => {
    expect(await getConsultas("consulta")).toHaveLength(8);
    expect(await getConsultas("transparencia")).toHaveLength(7);
    expect(await getConsultas("carnaval")).toHaveLength(1);
  });

  it("as 4 consultas de atividades usam os catálogos REAIS completos", async () => {
    const contagens = {
      "atividades-para-escritorios-virtuais": 318,
      "classificacao-de-risco-das-atividades": 1332,
      "atividades-para-profissionais-autonomos": 203,
      "atividades-permitidas-em-residencias": 170,
    };
    for (const [slug, total] of Object.entries(contagens)) {
      const consulta = await def("consulta", slug);
      expect(consulta.dados).toBe("real");
      expect(consulta.linhas).toHaveLength(total);
    }
  });

  it("consultas por número e painéis são demonstração (fictícios)", async () => {
    for (const slug of ["renovacao-de-publicidade-dam", "auto-de-infracao", "solicitacao-de-servicos", "alvara-de-publicidade"]) {
      expect((await def("consulta", slug)).dados).not.toBe("real");
    }
  });

  it("todo registro tem id único dentro da consulta", async () => {
    for (const grupo of ["consulta", "transparencia", "carnaval"] as const) {
      for (const consulta of await getConsultas(grupo)) {
        const ids = consulta.linhas.map((linha) => linha.id);
        expect(new Set(ids).size, consulta.slug).toBe(ids.length);
      }
    }
  });

  it("os dados de demonstração são determinísticos (mesmos valores a cada leitura)", async () => {
    const a = (await def("consulta", "renovacao-de-publicidade-dam")).linhas;
    const b = (await def("consulta", "renovacao-de-publicidade-dam")).linhas;
    expect(a).toEqual(b);
  });
});

describe("filtros", () => {
  it("CGA casa pelo valor inteiro (parcial não acha)", async () => {
    const dam = await def("consulta", "renovacao-de-publicidade-dam");
    for (const cga of ["90147", "69584", "68802", "49091", "92660"]) {
      expect(filtrarLinhas(dam, { cga }).length, cga).toBeGreaterThanOrEqual(1);
    }
    expect(filtrarLinhas(dam, { cga: "9014" })).toHaveLength(0);
    expect(filtrarLinhas(dam, { cga: "" })).toHaveLength(dam.linhas.length);
  });

  it("filtro geral ignora acento e caixa, em qualquer coluna", async () => {
    const risco = await def("consulta", "classificacao-de-risco-das-atividades");
    const achados = filtrarLinhas(risco, { filtro: "EXTRACAO DE SAL" });
    expect(achados.length).toBeGreaterThan(0);
    expect(achados.some((linha) => linha.cnae === "0892-4/02")).toBe(true);
    expect(filtrarLinhas(risco, { filtro: "0892-4/02" }).length).toBeGreaterThan(0);
  });

  it("período de datas: dentro do intervalo, e intervalo invertido não acha nada", async () => {
    const obras = await def("transparencia", "alvara-de-obras-em-vias-e-logradouros");
    const em2025 = filtrarLinhas(obras, { deferimento_de: "2025-01-01", deferimento_ate: "2025-12-31" });
    expect(em2025.length).toBeGreaterThan(0);
    expect(em2025.length).toBeLessThan(obras.linhas.length);
    expect(em2025.every((linha) => linha.deferimento.endsWith("/2025"))).toBe(true);
    expect(filtrarLinhas(obras, { deferimento_de: "2026-12-31", deferimento_ate: "2024-01-01" })).toHaveLength(0);
  });

  it("filtros combinam (E): processo de 3 campos", async () => {
    const habite = await def("transparencia", "alvaras-de-habite-se");
    const alvo = habite.linhas[0];
    const achados = filtrarLinhas(habite, { procorigem: alvo.procorigem, procano: alvo.procano, procnum: alvo.procnum });
    expect(achados.map((linha) => linha.id)).toContain(alvo.id);
    expect(filtrarLinhas(habite, { procorigem: alvo.procorigem, procano: "1900", procnum: alvo.procnum })).toHaveLength(0);
  });

  it("Processos em Convite: 17 grupos reais e filtro por grupo", async () => {
    const convite = await def("transparencia", "processos-em-convite");
    expect(convite.campos[0].opcoes).toHaveLength(17);
    const ambiental = filtrarLinhas(convite, { grupo: "AMBIENTAL" });
    expect(ambiental.length).toBeGreaterThan(0);
    expect(ambiental.every((linha) => linha.grupo === "AMBIENTAL")).toBe(true);
  });

  it("Carnaval: 15 datas (04/02 a 18/02) e 3 circuitos", async () => {
    const carnaval = await def("carnaval", "publicidade-em-blocos");
    const [data, circuito] = carnaval.campos;
    expect(data.opcoes).toHaveLength(15);
    expect(data.opcoes?.[0]).toBe("04/02");
    expect(data.opcoes?.at(-1)).toBe("18/02");
    expect(circuito.opcoes).toEqual(["Batatinha", "Dodô", "Osmar"]);
    const osmar = filtrarLinhas(carnaval, { circuito: "Osmar" });
    expect(osmar.length).toBeGreaterThan(0);
    expect(osmar.every((linha) => linha.circuito === "Osmar")).toBe(true);
  });
});

describe("tons de selo", () => {
  it.each([
    ["Concluída", "success"],
    ["Regularizado", "success"],
    ["Aprovado com condicionantes", "success"],
    ["Multa aplicada", "danger"],
    ["Em aberto", "warning"],
    ["Aguardando pagamento", "warning"],
    ["Em prazo de defesa", "warning"],
    ["Com pendência", "warning"],
    ["Em análise", "primary"],
    ["Arquivado", "neutral"],
  ])("situação %j -> %s", (texto, tom) => {
    expect(tomDaSituacao(texto)).toBe(tom);
  });

  it.each([
    ["ALTO", "danger"],
    ["ALTO DIVISA**", "danger"],
    ["BAIXO B", "warning"],
    ["BAIXO A", "success"],
    ["Inexigível", "neutral"],
    ["—", "neutral"],
  ])("risco %j -> %s", (texto, tom) => {
    expect(tomDoRisco(texto)).toBe(tom);
  });
});

describe("ficha de detalhe", () => {
  it("getRegistro devolve consulta e linha; id ou consulta inexistente dá undefined", async () => {
    const achado = await getRegistro("consulta", "auto-de-infracao", "1");
    expect(achado?.linha.id).toBe("1");
    expect(await getRegistro("consulta", "auto-de-infracao", "999999")).toBeUndefined();
    expect(await getRegistro("consulta", "nao-existe", "1")).toBeUndefined();
    // grupo errado não encontra
    expect(await getRegistro("transparencia", "auto-de-infracao", "1")).toBeUndefined();
  });

  it("risco mostra 4 níveis com selo do risco municipal", async () => {
    const risco = await def("consulta", "classificacao-de-risco-das-atividades");
    const receita = detalheDe(risco);
    expect(receita.niveis).toEqual(["urbanistico", "sanitario", "ambiental", "unificado"]);
    const linha = risco.linhas[0];
    expect(receita.selo?.(linha)?.texto).toBe(`Risco municipal: ${linha.unificado}`);
    expect(receita.titulo(linha)).toBe(linha.descricao);
  });

  it("auto de infração: a linha do tempo acompanha a situação", async () => {
    const receita = detalheDe(await def("consulta", "auto-de-infracao"));
    const etapas = (situacao: string) => receita.etapas!({ situacao }).map((e) => e.estado);
    expect(etapas("Em prazo de defesa")).toEqual(["feito", "atual", "pendente", "pendente"]);
    expect(etapas("Multa aplicada")).toEqual(["feito", "feito", "feito", "atual"]);
    expect(etapas("Regularizado")).toEqual(["feito", "feito", "feito", "feito"]);
  });

  it("solicitação: concluída = tudo feito; com pendência trava na análise e explica", async () => {
    const receita = detalheDe(await def("consulta", "solicitacao-de-servicos"));
    expect(receita.etapas!({ situacao: "Concluída" }).every((e) => e.estado === "feito")).toBe(true);
    const pendente = receita.etapas!({ situacao: "Com pendência" });
    expect(pendente.map((e) => e.estado)).toEqual(["feito", "atual", "pendente", "pendente"]);
    expect(pendente[1].detalhe).toMatch(/pendência/i);
  });

  it("painéis sem receita própria usam a ficha genérica (1ª coluna como título)", async () => {
    const eiv = await def("transparencia", "estudo-de-impacto-de-vizinhanca-eiv");
    const receita = detalheDe(eiv);
    const linha = eiv.linhas[0];
    expect(receita.titulo(linha)).toBe(linha.alvara);
    expect(receita.selo?.(linha)?.texto).toBe(linha.situacao);
  });
});
