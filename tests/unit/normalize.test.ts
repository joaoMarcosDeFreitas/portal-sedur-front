import { describe, expect, it } from "vitest";
import { dataCurta, dataPorExtenso } from "@/lib/normalize/data";
import { iniciais } from "@/lib/normalize/institucional";
import { chaveDoProcesso, descricaoLegivel, modalidadeDe } from "@/lib/normalize/licitacao";
import { dataParaISO, formatarTamanho, normalizarNumero } from "@/lib/normalize/legislacao";
import {
  linksDoDocumento,
  paraLista,
  paraParagrafo,
  parseDocumentos,
  parsePrazo,
  parseTaxas,
} from "@/lib/normalize/servico";
import { limparTexto, temConteudo } from "@/lib/normalize/texto";
import { parseProcesso, rotuloDoArquivo } from "@/lib/normalize/transparencia";
import { normalizar } from "@/lib/utils/normalizar";
import { slugify } from "@/lib/utils/slugify";

describe("texto", () => {
  it("troca o travessão quebrado do portal antigo", () => {
    expect(limparTexto("30 dias úteis ¿ prorrogáveis")).toBe("30 dias úteis – prorrogáveis");
  });

  it.each(["", "  ", "N/A", "n\\a", "-", "Não informado", undefined, null])("trata %j como sem conteúdo", (valor) => {
    expect(temConteudo(valor)).toBe(false);
  });

  it("reconhece conteúdo real", () => {
    expect(temConteudo("Prazo de 10 dias")).toBe(true);
  });
});

describe("serviço: documentos exigidos", () => {
  const texto = [
    "Lista de documentos",
    "Requerimento de Licenciamento",
    "ITEM INDISPENSÁVEL PARA ANÁLISE",
    "Procuração do requerente",
    "Observação: caso a solicitação seja feita por terceiros",
    "a) constando nome completo",
    "Certidão simplificada",
  ].join("\n");

  it("o marcador 'indispensável' vale para o documento ANTERIOR", () => {
    const docs = parseDocumentos(texto);
    expect(docs.map((d) => d.titulo)).toEqual(["Requerimento de Licenciamento", "Procuração do requerente", "Certidão simplificada"]);
    expect(docs[0].indispensavel).toBe(true);
    expect(docs[1].indispensavel).toBe(false);
  });

  it("junta 'Observação' e suas continuações ao documento certo", () => {
    const [, procuracao, certidao] = parseDocumentos(texto);
    expect(procuracao.observacoes).toEqual(["caso a solicitação seja feita por terceiros", "a) constando nome completo"]);
    expect(certidao.observacoes).toEqual([]);
  });

  it("aceita o marcador como última linha da lista", () => {
    const docs = parseDocumentos("Doc A\nITEM INDISPENSÁVEL PARA ANÁLISE");
    expect(docs).toHaveLength(1);
    expect(docs[0].indispensavel).toBe(true);
  });
});

describe("serviço: links dos documentos", () => {
  const links = [{ texto: "Requerimento de Licenciamento Ambiental", url: "u1" }, { texto: "Anuência do Autor Projeto", url: "u2" }];

  it("liga o link ao documento de mesmo nome, ignorando acento, caixa e pontuação", () => {
    expect(linksDoDocumento("Anuência do Autor Projeto", links)).toEqual([links[1]]);
    expect(linksDoDocumento("REQUERIMENTO de licenciamento ambiental.", links)).toEqual([links[0]]);
  });

  it("aceita quando o texto do link é parte do título do documento", () => {
    expect(linksDoDocumento("Requerimento de Licenciamento Ambiental (modelo anexo)", links)).toEqual([links[0]]);
  });

  it("não liga documentos diferentes", () => {
    expect(linksDoDocumento("Procuração do requerente", links)).toEqual([]);
  });
});

describe("serviço: taxas e prazo", () => {
  it("lê os pares descrição/valor e separa a nota legal", () => {
    const { itens, nota } = parseTaxas(
      ["Descrição", "Valor (R$)", "Licença por m²", "R$ 2,50", "Taxa de Expediente", "R$ 24,21", "Valores definidos com base na Lei", "nº 7.186/2006"].join("\n"),
    );
    expect(itens).toEqual([
      { descricao: "Licença por m²", valor: "R$ 2,50" },
      { descricao: "Taxa de Expediente", valor: "R$ 24,21" },
    ]);
    expect(nota).toBe("Valores definidos com base na Lei nº 7.186/2006");
  });

  it("a 1ª linha do prazo é o prazo; o resto são observações", () => {
    expect(parsePrazo("30 dias úteis.\nDiligências interrompem o prazo.")).toEqual({
      principal: "30 dias úteis.",
      observacoes: ["Diligências interrompem o prazo."],
    });
  });

  it("paraLista descarta linhas vazias e paraParagrafo junta as quebradas", () => {
    expect(paraLista("a\n\n  b  \n")).toEqual(["a", "b"]);
    expect(paraParagrafo("uma frase\nquebrada")).toBe("uma frase quebrada");
  });
});

describe("licitações", () => {
  it.each([
    ["Edital da Dispensa 03/2023", "Dispensa de licitação"],
    ["Concorrência nº 01/2023", "Concorrência"],
    ["Pregão Eletrônico 02/2022", "Pregão"],
    ["Audiência pública do EIV", "Audiência pública"],
    ["Edital de Credenciamento 01/2023", "Credenciamento"],
    ["Chamamento público 06/2023", "Chamamento público"],
    ["Estudo de Viabilidade – Anexo 2", "Estudos e anexos"],
    ["Comunicado geral", "Outros editais"],
  ])("deduz a modalidade de %j", (titulo, esperado) => {
    expect(modalidadeDe(titulo)).toBe(esperado);
  });

  it("agrupa edital, aviso e retificação pelo processo (modalidade + número/ano)", () => {
    const m = modalidadeDe("Retificação da Concorrência 001/2023");
    expect(chaveDoProcesso("Retificação da Concorrência 001/2023", m)).toBe("Concorrência 1/2023");
    expect(chaveDoProcesso("Edital Concorrência nº 1 / 2023", modalidadeDe("Concorrência"))).toBe("Concorrência 1/2023");
  });

  it("não agrupa estudos e anexos", () => {
    expect(chaveDoProcesso("Estudo 2/2023", "Estudos e anexos")).toBeUndefined();
  });

  it("converte objetos em MAIÚSCULAS para caixa de frase, preservando siglas", () => {
    const saida = descricaoLegivel("CONTRATAÇÃO DE EMPRESA PARA A SEDUR NO MUNICÍPIO DE SALVADOR, C ONFORME ANEXO II.");
    expect(saida.startsWith("Contratação de empresa para a SEDUR")).toBe(true);
    expect(saida).toContain("Salvador");
    expect(saida).toContain("conforme anexo II");
    expect(saida).not.toContain("C onforme");
  });

  it("não mexe em textos que já têm minúsculas", () => {
    expect(descricaoLegivel("Contratação de empresa")).toBe("Contratação de empresa");
  });

  it("junta as palavras que o portal antigo entrega partidas (lista fechada)", () => {
    expect(descricaoLegivel("C ontratação de empresa, no M unicípio de S alvador")).toBe("Contratação de empresa, no Município de Salvador");
    expect(descricaoLegivel("por necessi dade de intervenção")).toBe("por necessidade de intervenção");
    expect(descricaoLegivel("estabelecidas n o Edital e seus Anexos.")).toBe("estabelecidas no Edital e seus Anexos.");
  });

  it("não estraga frases corretas que começam com uma letra isolada", () => {
    expect(descricaoLegivel("A presente licitação. O aviso foi publicado.")).toBe("A presente licitação. O aviso foi publicado.");
  });

  it("nenhuma descrição de licitação real sai com palavra partida", async () => {
    const { getEntradasDeLicitacoes } = await import("@/lib/data/licitacoes");
    const textos = (await getEntradasDeLicitacoes()).map((e) => e.descricao).join(" ");
    for (const partida of ["C ontrata", "necessi dade", "M unicípio", "S alvador", "n o Edital"]) {
      expect(textos, partida).not.toContain(partida);
    }
  });
});

describe("legislação", () => {
  it("dataParaISO devolve texto ordenável", () => {
    expect(dataParaISO("23/09/2021")).toBe("2021-09-23");
    expect(dataParaISO("3/9/2021")).toBe("2021-09-03");
    expect(dataParaISO("sem data")).toBe("");
  });

  it("normalizarNumero uniformiza 'nº' e tira o ponto final", () => {
    expect(normalizarNumero("Decreto n° 27.946/2016.")).toBe("Decreto nº 27.946/2016");
    expect(normalizarNumero("lei nº 9.069/2016")).toBe("Lei nº 9.069/2016");
  });

  it("formatarTamanho", () => {
    expect(formatarTamanho(undefined)).toBeUndefined();
    expect(formatarTamanho(141 * 1024)).toBe("141 KB");
    expect(formatarTamanho(1.5 * 1024 * 1024)).toBe("1,5 MB");
  });
});

describe("transparência, datas e utilitários", () => {
  it("parseProcesso separa os quatro campos", () => {
    expect(parseProcesso("Processo: 123/2021 (EIV) Nome do empreendimento: Colina Imperial Localização: Pituba Empreendedor: MRV")).toEqual({
      processo: "123/2021 (EIV)",
      empreendimento: "Colina Imperial",
      local: "Pituba",
      empreendedor: "MRV",
    });
  });

  it("rotuloDoArquivo deixa o nome legível", () => {
    expect(rotuloDoArquivo("EIV_parte3")).toBe("EIV — parte 3");
    expect(rotuloDoArquivo("RIV")).toBe("RIV — Relatório de Impacto de Vizinhança");
    expect(rotuloDoArquivo("Anexo2_Mapa de Localização")).toBe("Anexo 2 — Mapa de Localização");
  });

  it("datas ISO não dependem de fuso", () => {
    expect(dataPorExtenso("2026-09-11")).toBe("11 de setembro de 2026");
    expect(dataCurta("2026-09-11")).toBe("11/09/2026");
    expect(dataPorExtenso("lixo")).toBe("lixo");
  });

  it("iniciais do avatar", () => {
    expect(iniciais("Sosthenes Tavares de Macêdo Almeida")).toBe("SA");
    expect(iniciais("Maria")).toBe("M");
  });

  it("slugify e normalizar ignoram acento e caixa", () => {
    expect(slugify("Licença para Reforma Simples")).toBe("licenca-para-reforma-simples");
    expect(slugify("  Caixa d´Água!! ")).toBe("caixa-d-agua");
    expect(normalizar("  Habite-se  ")).toBe("habite-se");
    expect(normalizar("Ação")).toBe("acao");
  });
});
