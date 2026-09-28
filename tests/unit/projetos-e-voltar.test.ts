import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getProjetos, type BlocoPronto, type TrechoPronto } from "@/lib/data/institucional";
import { paginaDeCima, registrarPagina } from "@/lib/navegacao/voltar";

const publico = (caminho: string) => resolve(__dirname, "../../public", caminho.replace(/^\//, ""));

function trechosDe(blocos: BlocoPronto[]): TrechoPronto[] {
  return blocos.flatMap((b) => (b.tipo === "paragrafo" || b.tipo === "titulo" ? b.runs : b.tipo === "lista" ? b.itens.flat() : []));
}

describe("Nossos Projetos: conteúdo do site atual", () => {
  it("os 6 projetos originais têm ilustração (arquivo existe) e conteúdo; os 2 informativos têm seções", async () => {
    const projetos = await getProjetos();
    const originais = projetos.filter((p) => p.conteudo);
    expect(originais.map((p) => p.slug)).toEqual(["plano-de-incentivos-fiscais", "eu-curto-meu-passeio", "conselho-municipal-salvador", "tul", "revitalizar", "pidi"]);
    for (const p of originais) {
      expect(p.imagem, p.slug).toBeTruthy();
      expect(existsSync(publico(p.imagem!)), p.slug).toBe(true);
      expect(p.conteudo!.length, p.slug).toBeGreaterThan(0);
    }
    expect(projetos.filter((p) => p.blocos).map((p) => p.slug)).toEqual(["iptu-verde", "revisao-do-pddu"]);
  });

  it("toda imagem do conteúdo existe em public/ e traz o tamanho real", async () => {
    const projetos = await getProjetos();
    const imagens = projetos.flatMap((p) => p.conteudo ?? []).filter((b) => b.tipo === "imagem");
    expect(imagens).toHaveLength(3);
    for (const img of imagens) {
      expect(existsSync(publico(img.src)), img.src).toBe(true);
      expect(img.larguraReal).toBeGreaterThan(0);
      expect(img.alturaReal).toBeGreaterThan(0);
      expect(img.alt.length).toBeGreaterThan(5);
    }
  });

  it("Revitalizar: tabela dos 13 bairros e o passo a passo (1º ao 7º)", async () => {
    const revitalizar = (await getProjetos()).find((p) => p.slug === "revitalizar")!;
    const tabela = revitalizar.conteudo!.find((b) => b.tipo === "tabela");
    expect(tabela && tabela.tipo === "tabela" && tabela.linhas).toHaveLength(13);
    const textos = trechosDe(revitalizar.conteudo!).map((t) => t.texto).join(" ");
    for (const passo of ["1º", "2º", "3º", "4º", "5º", "6º", "7º"]) expect(textos).toContain(passo);
  });

  it("links: serviço e categoria do portal antigo viram páginas daqui; os mortos viram só texto", async () => {
    const projetos = await getProjetos();
    const trechos = (slug: string) => trechosDe(projetos.find((p) => p.slug === slug)!.conteudo!);

    const adesao = trechos("plano-de-incentivos-fiscais").find((t) => t.texto === "Adesão ao Plano de Incentivos Fiscais");
    expect(adesao).toMatchObject({ interno: true });
    expect(adesao?.href).toMatch(/^\/servicos\/desenvolvimento-economico\/adesao-ao-plano-de-incentivos-fiscais-6992$/);

    const carta = trechos("tul").find((t) => t.texto.startsWith("Clique aqui para acessar a carta de serviço"));
    expect(carta).toMatchObject({ interno: true, href: "/servicos/desenvolvimento-economico" });

    const mortos = trechos("revitalizar").filter((t) => t.indisponivel);
    expect(mortos).toHaveLength(2);
    for (const t of mortos) expect(t.href).toBeUndefined();

    // nenhum link para o Portal de Serviços antigo (endereços que não existem mais aqui) fica no conteúdo
    for (const p of projetos) for (const t of trechosDe(p.conteudo ?? [])) expect(t.href ?? "", p.slug).not.toMatch(/servicos\.sedur\.salvador\.ba\.gov\.br/);
  });

  it("Eu Curto Meu Passeio é só o banner, que leva ao PDF do programa", async () => {
    const p = (await getProjetos()).find((x) => x.slug === "eu-curto-meu-passeio")!;
    expect(p.conteudo).toHaveLength(1);
    expect(p.conteudo![0]).toMatchObject({ tipo: "imagem", href: "https://sedur.salvador.ba.gov.br/arquivos/pdf/meupasseio2021.pdf" });
  });
});

describe("botão Voltar: página de cima (quando não há de onde voltar)", () => {
  it("sobe um nível", () => {
    expect(paginaDeCima("/servicos/ambiental/alteracao-de-razao-social-6876", "")).toBe("/servicos/ambiental");
    expect(paginaDeCima("/servicos/ambiental", "")).toBe("/servicos");
    expect(paginaDeCima("/projetos/tul", "")).toBe("/projetos");
    expect(paginaDeCima("/legislacao/cnlu/comunicados", "")).toBe("/legislacao/cnlu");
  });
  it("página de primeiro nível volta para a home", () => {
    expect(paginaDeCima("/servicos", "")).toBe("/");
    expect(paginaDeCima("/login", "")).toBe("/");
  });
  it("solicitar leva aos serviços", () => {
    expect(paginaDeCima("/solicitar/6876/emitir-dam", "")).toBe("/servicos");
  });
  it("detalhe de consulta/painel mantém os filtros da lista", () => {
    expect(paginaDeCima("/consultas/auto-de-infracao/1", "?numero=091135&pagina=2")).toBe("/consultas/auto-de-infracao?numero=091135&pagina=2");
    expect(paginaDeCima("/transparencia/carnaval/publicidade-em-blocos/4", "?circuito=dodo")).toBe("/transparencia/carnaval/publicidade-em-blocos?circuito=dodo");
    // páginas comuns não carregam a busca junto
    expect(paginaDeCima("/noticias/100", "?q=pddu")).toBe("/noticias");
  });
});

describe("botão Voltar: pilha de páginas da aba", () => {
  const memoria = new Map<string, string>();
  beforeEach(() => {
    memoria.clear();
    vi.stubGlobal("sessionStorage", {
      getItem: (chave: string) => memoria.get(chave) ?? null,
      setItem: (chave: string, valor: string) => void memoria.set(chave, valor),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("entrar direto numa página: só ela na pilha (não há de onde voltar)", () => {
    expect(registrarPagina("/servicos/ambiental")).toEqual(["/servicos/ambiental"]);
  });
  it("navegar empilha; recarregar não duplica; voltar desempilha", () => {
    registrarPagina("/");
    registrarPagina("/servicos");
    expect(registrarPagina("/servicos/ambiental")).toEqual(["/", "/servicos", "/servicos/ambiental"]);
    expect(registrarPagina("/servicos/ambiental")).toHaveLength(3);
    expect(registrarPagina("/servicos")).toEqual(["/", "/servicos"]);
    expect(registrarPagina("/")).toEqual(["/"]);
  });
  it("filtros diferentes na mesma página contam como passos (o Voltar desfaz um de cada vez)", () => {
    registrarPagina("/consultas/x");
    expect(registrarPagina("/consultas/x?cga=1")).toEqual(["/consultas/x", "/consultas/x?cga=1"]);
  });
  it("sem sessionStorage funciona (sem de onde voltar)", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("bloqueado");
      },
      setItem: () => {
        throw new Error("bloqueado");
      },
    });
    expect(registrarPagina("/servicos")).toEqual(["/servicos"]);
  });
});
