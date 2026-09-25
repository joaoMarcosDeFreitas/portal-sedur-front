import { describe, expect, it } from "vitest";
import paginasRaw from "@/data/paginas-informativas.json";
import { getProjetos } from "@/lib/data/institucional";
import { getFormularios } from "@/lib/data/formularios";
import { buscarLegislacao, getResumoSecoes } from "@/lib/data/legislacao";
import { getEntradasDeLicitacoes } from "@/lib/data/licitacoes";
import { buscarNoticias, getAnosDasNoticias, getNoticiaPorId, getTodasAsNoticias, getVizinhas } from "@/lib/data/noticias";
import {
  acoesDoServico,
  getCategorias,
  getServicoPorId,
  getServicoPorSlug,
  getTodosOsServicos,
  resolverLinkDeFicha,
  slugDaCategoria,
  slugDoServico,
} from "@/lib/data/servicos";
import { dataParaISO } from "@/lib/normalize/legislacao";
import { linksDoDocumento, parseDocumentos } from "@/lib/normalize/servico";

describe("serviços", () => {
  it("13 categorias e 151 serviços, todos ligados a uma categoria existente", async () => {
    const [categorias, servicos] = await Promise.all([getCategorias(), getTodosOsServicos()]);
    expect(categorias).toHaveLength(13);
    expect(servicos).toHaveLength(151);
    const ids = new Set(categorias.map((c) => c.id));
    for (const servico of servicos) expect(ids.has(servico.categoria_id), servico.nome).toBe(true);
    expect(categorias.reduce((soma, c) => soma + c.total, 0)).toBe(151);
  });

  it("slugs são únicos e o do serviço termina no id (URLs estáveis)", async () => {
    const [categorias, servicos] = await Promise.all([getCategorias(), getTodosOsServicos()]);
    expect(new Set(categorias.map(slugDaCategoria)).size).toBe(13);
    const slugs = servicos.map(slugDoServico);
    expect(new Set(slugs).size).toBe(151);
    servicos.forEach((servico, i) => expect(slugs[i].endsWith(`-${servico.id}`)).toBe(true));
  });

  it("achar por slug devolve o mesmo serviço", async () => {
    const servico = (await getTodosOsServicos())[10];
    const categoria = slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria });
    expect((await getServicoPorSlug(categoria, slugDoServico(servico)))?.id).toBe(servico.id);
    expect(await getServicoPorId("id-que-nao-existe")).toBeUndefined();
  });

  it("todo serviço tem nome e a aba de descrição existe como campo", async () => {
    for (const servico of await getTodosOsServicos()) {
      expect(servico.nome.trim().length, servico.id).toBeGreaterThan(2);
      expect(servico.abas, servico.id).toBeTypeOf("object");
    }
  });
});

describe("serviços: ações reais de cada ficha", () => {
  it("81 só emitem DAM, 50 só abrem processo, 5 têm as duas e 15 não têm botão (como no portal atual)", async () => {
    const contagem = { dam: 0, processo: 0, ambos: 0, nenhuma: 0 };
    for (const servico of await getTodosOsServicos()) {
      const tipos = acoesDoServico(servico).map((a) => a.tipo);
      if (tipos.length === 0) contagem.nenhuma += 1;
      else if (tipos.length === 2) contagem.ambos += 1;
      else if (tipos[0] === "dam") contagem.dam += 1;
      else contagem.processo += 1;
    }
    expect(contagem).toEqual({ dam: 81, processo: 50, ambos: 5, nenhuma: 15 });
  });

  it("usa os textos e endereços reais dos botões", async () => {
    const razaoSocial = (await getServicoPorId("6876"))!;
    expect(acoesDoServico(razaoSocial)).toEqual([
      { tipo: "dam", segmento: "emitir-dam", rotulo: "Emissão de DAM", href: "/solicitar/6876/emitir-dam" },
    ]);
    const aop = (await getServicoPorId("1354"))!;
    expect(acoesDoServico(aop).map((a) => a.rotulo)).toEqual(["Emissão de DAM", "Abrir processo"]);
    expect(acoesDoServico((await getServicoPorId("7004"))!)).toEqual([]);
  });

  it("todo serviço que emite DAM tem taxa em reais na ficha (o DAM tem valor)", async () => {
    for (const servico of await getTodosOsServicos()) {
      if (!acoesDoServico(servico).some((a) => a.tipo === "dam")) continue;
      expect(servico.abas.taxas ?? "", servico.nome).toMatch(/R\$\s?\d/);
    }
  });
});

describe("serviços: links dentro das fichas", () => {
  it("todos os 48 links de documentos casam com um documento exigido do mesmo serviço", async () => {
    let total = 0;
    for (const servico of await getTodosOsServicos()) {
      const links = servico.links_nas_abas?.["documentacao-exigida"] ?? [];
      const documentos = parseDocumentos(servico.abas["documentacao-exigida"] ?? "");
      for (const link of links) {
        total += 1;
        const ligado = documentos.some((doc) => linksDoDocumento(doc.titulo, [link]).length > 0);
        expect(ligado, `${servico.nome} → ${link.texto}`).toBe(true);
      }
    }
    expect(total).toBe(48);
  });

  it("link para outra ficha vira link interno; http vira https e espaços são codificados", async () => {
    const interno = await resolverLinkDeFicha({ texto: "Planta de Geolocalização", url: "http://servicos.sedur.salvador.ba.gov.br/#/portal/carta-servicos/servico/6879" });
    expect(interno.interno).toBe(true);
    expect(interno.url).toBe("/servicos/urbanismo/geolocalizacao-do-imovel-6879");

    const externo = await resolverLinkDeFicha({ texto: "Anexo", url: "http://sedur.salvador.ba.gov.br/arquivos/2022/ANEXO I.pdf" });
    expect(externo).toEqual({ texto: "Anexo", url: "https://sedur.salvador.ba.gov.br/arquivos/2022/ANEXO%20I.pdf", interno: false });
  });

  it("link para ficha inexistente segue como link externo (não quebra)", async () => {
    const l = await resolverLinkDeFicha({ texto: "X", url: "https://servicos.sedur.salvador.ba.gov.br/#/portal/carta-servicos/servico/99999999" });
    expect(l.interno).toBe(false);
  });
});

describe("notícias", () => {
  it("804 notícias com ids únicos, e a busca acha por título sem exigir acento", async () => {
    const todas = await getTodasAsNoticias();
    expect(todas).toHaveLength(804);
    expect(new Set(todas.map((n) => n.id)).size).toBe(804);

    const { itens, total } = await buscarNoticias({ q: "revisao do pddu", porPagina: 1000 });
    expect(total).toBeGreaterThan(0);
    expect(itens.length).toBe(total);
  });

  it("paginação e filtro por ano", async () => {
    const pagina1 = await buscarNoticias({ pagina: 1, porPagina: 12 });
    const pagina2 = await buscarNoticias({ pagina: 2, porPagina: 12 });
    expect(pagina1.itens).toHaveLength(12);
    expect(pagina1.itens[0].id).not.toBe(pagina2.itens[0].id);
    const anos = await getAnosDasNoticias();
    expect(anos.length).toBeGreaterThan(5);
    const doAno = await buscarNoticias({ ano: anos[0], porPagina: 1000 });
    expect(doAno.itens.every((n) => n.data.startsWith(anos[0]))).toBe(true);
  });

  it("anterior/próxima: a mais recente não tem 'mais recente', e a vizinha é de data consistente", async () => {
    const [maisNova] = (await buscarNoticias({ porPagina: 1 })).itens;
    const v = await getVizinhas(maisNova.id);
    expect(v.maisRecente).toBeUndefined();
    expect(v.maisAntiga).toBeDefined();
    expect(v.maisAntiga!.data <= maisNova.data).toBe(true);
    expect(await getNoticiaPorId(-1)).toBeUndefined();
  });
});

describe("legislação, licitações e formulários", () => {
  it("14 tipos de norma e 1.079 documentos, sem perder nenhum na soma por tipo", async () => {
    const secoes = await getResumoSecoes();
    expect(secoes).toHaveLength(14);
    expect(secoes.reduce((s, x) => s + x.total, 0)).toBe(1079);
    expect((await buscarLegislacao({ porPagina: 1 })).total).toBe(1079);
  });

  it("legislação vem do mais novo ao mais antigo e filtra por tipo e busca", async () => {
    const { itens } = await buscarLegislacao({ porPagina: 200 });
    const iso = itens.map((item) => dataParaISO(item.data));
    expect(iso).toEqual([...iso].sort().reverse());
    const decretos = await buscarLegislacao({ secao: "decretos", porPagina: 1000 });
    expect(decretos.total).toBeGreaterThan(100);
    expect(decretos.itens.every((d) => d.secaoId === "decretos")).toBe(true);
    const achado = await buscarLegislacao({ q: "coleta de oleos", porPagina: 5 });
    expect(achado.total).toBeGreaterThan(0);
  });

  it("licitações: processos agrupados, cada entrada com documentos e modalidade válida", async () => {
    const entradas = await getEntradasDeLicitacoes();
    expect(entradas.length).toBeLessThan(57);
    expect(entradas.length).toBeGreaterThan(40);
    for (const e of entradas) {
      expect(e.documentos.length, e.titulo).toBeGreaterThan(0);
      expect(e.ano, e.titulo).toMatch(/^\d{4}$/);
    }
    const c1 = entradas.find((e) => e.titulo === "Concorrência 1/2023");
    expect(c1?.documentos.length).toBeGreaterThan(1);
  });

  it("formulários: 53 únicos, incluindo os 3 anexos do IPTU Verde", async () => {
    const formularios = await getFormularios();
    expect(formularios).toHaveLength(53);
    const iptu = formularios.filter((f) => /iptu verde/i.test(f.titulo));
    expect(iptu.map((f) => f.titulo)).toEqual([
      "Formulário Anexo 01 - IPTU Verde",
      "Formulário Anexo 02 - IPTU Verde",
      "Formulário Anexo 03 - IPTU Verde",
    ]);
  });
});

describe("páginas informativas e projetos", () => {
  const paginas = (paginasRaw as { paginas: { slug: string; blocos: { titulo: string; paragrafos?: string[]; itens?: string[] }[]; links: { texto: string; url: string }[] }[] }).paginas;

  it("IPTU Verde e Revisão do PDDU têm conteúdo estruturado", () => {
    expect(paginas.map((p) => p.slug)).toEqual(["iptu-verde", "revisao-do-pddu"]);
    for (const p of paginas) {
      expect(p.blocos.length).toBeGreaterThanOrEqual(4);
      for (const bloco of p.blocos) expect((bloco.paragrafos?.length ?? 0) + (bloco.itens?.length ?? 0), bloco.titulo).toBeGreaterThan(0);
    }
  });

  it("IPTU Verde não inventa percentuais de desconto (o original não informa)", () => {
    const texto = JSON.stringify(paginas.find((p) => p.slug === "iptu-verde")!.blocos);
    expect(texto).not.toMatch(/\d\s?%/);
  });

  it("IPTU Verde traz os 3 formulários e todo link é https", () => {
    const iptu = paginas.find((p) => p.slug === "iptu-verde")!;
    expect(iptu.links).toHaveLength(3);
    for (const p of paginas) for (const l of p.links) expect(l.url, l.texto).toMatch(/^https:\/\//);
  });

  it("getProjetos junta os 6 projetos aos 2 conteúdos, com slugs únicos", async () => {
    const projetos = await getProjetos();
    expect(projetos).toHaveLength(8);
    expect(new Set(projetos.map((p) => p.slug)).size).toBe(8);
    const iptu = projetos.find((p) => p.slug === "iptu-verde");
    expect(iptu?.blocos?.length).toBeGreaterThan(0);
    expect(iptu?.links.every((l) => !l.interno)).toBe(true);
  });
});
