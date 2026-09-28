// Coleta "Nossos Projetos" do site atual da SEDUR e grava data/projetos-conteudo.json com o conteúdo
// ESTRUTURADO de cada página (parágrafos, listas, tabelas, imagens e links dentro do texto).
//
// Uso:  node scripts/coletar-projetos.mjs
//
// Regras da coleta (as mesmas do resto do projeto): só leitura, UM pedido por vez com 2 s de pausa, e para se o
// firewall da Prefeitura responder "Acesso Bloqueado". O resultado é versionado; o script existe para poder refazer.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://sedur.salvador.ba.gov.br";
const PROJETOS = ["plano-de-incentivos-fiscais", "eu-curto-meu-passeio", "conselho-municipal-salvador", "tul", "revitalizar", "pidi"];

/** Imagens do conteúdo que já foram baixadas para public/projetos (o endereço antigo -> o arquivo daqui). */
const IMAGENS_LOCAIS = {
  "/images/arquivos_processos/2019/11/banner.png": "/projetos/eu-curto-meu-passeio-banner.png",
  "/images/arquivos_processos/2019/05/tulManual.jpg": "/projetos/tul-manual.jpg",
  "/images/arquivos_processos/2017/09/Poligonal_Revitalizar.jpg": "/projetos/revitalizar-poligonal.jpg",
};

/** Texto alternativo que descreve a imagem para quem não a vê (o do site atual é o nome do arquivo). */
const ALT_DAS_IMAGENS = {
  "/projetos/eu-curto-meu-passeio-banner.png": "Eu Curto Meu Passeio: abrir o material do programa (PDF)",
  "/projetos/tul-manual.jpg": "Capa do Manual da TUL",
  "/projetos/revitalizar-poligonal.jpg": "Mapa da poligonal de abrangência do Programa Revitalizar",
};

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

// --- HTML → árvore ------------------------------------------------------------------------------------------

const VAZIAS = new Set(["br", "img", "hr", "input", "meta", "link"]);
const ENTIDADES = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", ordm: "º", ordf: "ª", ndash: "–", mdash: "—", laquo: "«", raquo: "»",
  ccedil: "ç", Ccedil: "Ç", atilde: "ã", Atilde: "Ã", otilde: "õ", Otilde: "Õ", aacute: "á", Aacute: "Á", eacute: "é", Eacute: "É",
  iacute: "í", Iacute: "Í", oacute: "ó", Oacute: "Ó", uacute: "ú", Uacute: "Ú", acirc: "â", Acirc: "Â", ecirc: "ê", Ecirc: "Ê",
  ocirc: "ô", Ocirc: "Ô", agrave: "à", Agrave: "À", uuml: "ü", sect: "§", deg: "°", bull: "•", hellip: "…", rsquo: "’", lsquo: "‘",
  ldquo: "“", rdquo: "”", copy: "©",
};
const decodificar = (texto) =>
  texto
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, nome) => ENTIDADES[nome] ?? m);

function atributos(texto) {
  const saida = {};
  for (const m of texto.matchAll(/([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) saida[m[1].toLowerCase()] = decodificar(m[2] ?? m[3] ?? "");
  return saida;
}

function arvore(html) {
  const raiz = { tag: "#raiz", attrs: {}, filhos: [] };
  const pilha = [raiz];
  const limpo = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  for (const m of limpo.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>|([^<]+)/g)) {
    const topo = pilha[pilha.length - 1];
    if (m[4] !== undefined) {
      topo.filhos.push({ tag: "#texto", texto: decodificar(m[4]) });
      continue;
    }
    const fechando = m[1] === "/";
    const tag = m[2].toLowerCase();
    if (fechando) {
      // fecha até o último aberto com esse nome (tolera HTML mal formado)
      for (let i = pilha.length - 1; i > 0; i -= 1) {
        if (pilha[i].tag === tag) {
          pilha.length = i;
          break;
        }
      }
      continue;
    }
    const no = { tag, attrs: atributos(m[3]), filhos: [] };
    topo.filhos.push(no);
    if (!VAZIAS.has(tag) && !m[3].trim().endsWith("/")) pilha.push(no);
  }
  return raiz;
}

/** Acha o <div itemprop="articleBody"> (o corpo do artigo do Joomla). */
function acharCorpo(no) {
  if (no.tag === "div" && no.attrs.itemprop === "articleBody") return no;
  for (const filho of no.filhos ?? []) {
    const achado = acharCorpo(filho);
    if (achado) return achado;
  }
  return undefined;
}

// --- árvore → blocos ------------------------------------------------------------------------------------------

const absoluto = (url) => {
  if (!url) return url;
  const u = url.trim();
  if (u.startsWith("//")) return `https:${u}`;
  if (u.startsWith("/")) return `${SITE}${u}`;
  return u.replace(/^http:/, "https:");
};

/** Junta trechos vizinhos com a mesma formatação e tira espaços das pontas. */
function compactar(runs) {
  const juntos = [];
  for (const r of runs) {
    const ant = juntos[juntos.length - 1];
    if (ant && ant.negrito === r.negrito && ant.italico === r.italico && ant.href === r.href) ant.texto += r.texto;
    else juntos.push({ ...r });
  }
  if (juntos.length) juntos[0].texto = juntos[0].texto.replace(/^\s+/, "");
  if (juntos.length) juntos[juntos.length - 1].texto = juntos[juntos.length - 1].texto.replace(/\s+$/, "");
  return juntos.map((r) => ({ ...r, texto: r.texto.replace(/[ \t\r\n]+/g, (e) => (e.includes("\n") && r.quebra ? e : " ")) })).filter((r) => r.texto !== "");
}

function inline(no, estilo, saida) {
  for (const f of no.filhos) {
    if (f.tag === "#texto") {
      saida.push({ texto: f.texto.replace(/ /g, " "), negrito: estilo.negrito, italico: estilo.italico, href: estilo.href });
    } else if (f.tag === "br") {
      saida.push({ texto: " ", negrito: false, italico: false });
    } else if (f.tag === "img") {
      continue; // imagens viram bloco à parte (ver `blocos`)
    } else {
      const novo = { ...estilo };
      if (f.tag === "strong" || f.tag === "b") novo.negrito = true;
      if (f.tag === "em" || f.tag === "i") novo.italico = true;
      if (f.tag === "a" && f.attrs.href) novo.href = absoluto(f.attrs.href);
      inline(f, novo, saida);
    }
  }
}

const runsDe = (no) => {
  const saida = [];
  inline(no, { negrito: false, italico: false, href: undefined }, saida);
  return compactar(saida).map((r) => {
    const item = { texto: r.texto };
    if (r.negrito) item.negrito = true;
    if (r.italico) item.italico = true;
    if (r.href) item.href = r.href;
    return item;
  });
};

const textoPuro = (no) =>
  (no.tag === "#texto" ? no.texto : (no.filhos ?? []).map(textoPuro).join(" ")).replace(/[ \s]+/g, " ").trim();

function imagensEm(no, acumulado = [], dentroDeLink) {
  for (const f of no.filhos ?? []) {
    if (f.tag === "img" && f.attrs.src) acumulado.push({ img: f, href: dentroDeLink });
    else imagensEm(f, acumulado, f.tag === "a" ? absoluto(f.attrs.href) : dentroDeLink);
  }
  return acumulado;
}

function blocoDeImagem({ img, href }) {
  const original = img.attrs.src.replace(SITE, "");
  const src = IMAGENS_LOCAIS[original];
  if (!src) throw new Error(`Imagem sem cópia local: ${original} (baixe para public/projetos e inclua em IMAGENS_LOCAIS)`);
  const bloco = { tipo: "imagem", src, alt: ALT_DAS_IMAGENS[src] ?? (img.attrs.alt ?? "").trim() };
  if (img.attrs.width) bloco.largura = Number(img.attrs.width);
  if (href) bloco.href = href;
  return bloco;
}

function blocos(no, saida = []) {
  for (const f of no.filhos) {
    if (f.tag === "#texto") {
      if (f.texto.trim()) saida.push({ tipo: "paragrafo", runs: runsDe({ filhos: [f] }) });
    } else if (f.tag === "p") {
      const runs = runsDe(f);
      if (runs.length) saida.push({ tipo: "paragrafo", runs });
      for (const imagem of imagensEm(f)) saida.push(blocoDeImagem(imagem));
    } else if (f.tag === "ul" || f.tag === "ol") {
      const itens = f.filhos.filter((x) => x.tag === "li").map(runsDe).filter((r) => r.length);
      if (itens.length) saida.push({ tipo: "lista", ordenada: f.tag === "ol", itens });
    } else if (/^h[2-4]$/.test(f.tag)) {
      const runs = runsDe(f);
      if (runs.length) saida.push({ tipo: "titulo", runs });
    } else if (f.tag === "table") {
      const linhas = [];
      const varrer = (n) => {
        for (const x of n.filhos) {
          if (x.tag === "tr") linhas.push(x.filhos.filter((c) => c.tag === "td" || c.tag === "th").map(textoPuro));
          else if (x.filhos) varrer(x);
        }
      };
      varrer(f);
      const cheias = linhas.filter((l) => l.some(Boolean));
      if (cheias.length) saida.push({ tipo: "tabela", cabecalho: cheias[0], linhas: cheias.slice(1) });
    } else if (f.tag === "img") {
      saida.push(blocoDeImagem({ img: f }));
    } else if (f.tag === "a" && f.attrs.href && imagensEm(f).length === 0) {
      const runs = runsDe({ filhos: [f] });
      if (runs.length) saida.push({ tipo: "paragrafo", runs });
    } else if (f.filhos) {
      blocos(f, saida);
    }
  }
  return saida;
}

// --- coleta ---------------------------------------------------------------------------------------------------

const projetos = [];
for (const slug of PROJETOS) {
  await pausa(2000);
  const resposta = await fetch(`${SITE}/${slug}`, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await resposta.text();
  if (!resposta.ok || html.includes("Acesso Bloqueado")) throw new Error(`Falha ao coletar ${slug}: HTTP ${resposta.status}`);
  const corpo = acharCorpo(arvore(html));
  if (!corpo) throw new Error(`Corpo do artigo não encontrado em ${slug}`);
  const lista = blocos(corpo);
  projetos.push({ slug, url: `${SITE}/${slug}`, blocos: lista });
  console.log(`${slug}: ${lista.length} blocos (${lista.map((b) => b.tipo).join(", ")})`);
}

// Marca os links mortos usando a conferência de links já feita (data/verificacao-de-links.json).
const verificacao = JSON.parse(readFileSync(resolve(RAIZ, "data/verificacao-de-links.json"), "utf8"));
const status = (url) => {
  const v = verificacao[url] ?? verificacao[url.replace(/^https:/, "http:")];
  return v?.status ?? v?.http ?? v?.codigo;
};
let mortos = 0;
for (const p of projetos) {
  const marcar = (runs) => {
    for (const r of runs) {
      if (r.href) {
        const s = status(r.href);
        if (s === 404 || s === 0) {
          r.indisponivel = true;
          mortos += 1;
        }
      }
    }
  };
  for (const b of p.blocos) {
    if (b.runs) marcar(b.runs);
    if (b.itens) b.itens.forEach(marcar);
  }
}

// Tamanho real de cada imagem copiada (o Next precisa da proporção para reservar o espaço sem "pulo" de layout).
const { default: sharp } = await import("sharp");
for (const p of projetos) {
  for (const b of p.blocos) {
    if (b.tipo !== "imagem") continue;
    const { width, height } = await sharp(resolve(RAIZ, "public", b.src.replace(/^\//, ""))).metadata();
    b.larguraReal = width;
    b.alturaReal = height;
  }
}

mkdirSync(resolve(RAIZ, "data"), { recursive: true });
writeFileSync(
  resolve(RAIZ, "data/projetos-conteudo.json"),
  JSON.stringify({ fonte: `${SITE} (páginas dos 6 projetos de "Nossos Projetos")`, coletado_em: new Date().toISOString().slice(0, 10), projetos }, null, 2) + "\n",
);
console.log(`\nGravado data/projetos-conteudo.json (${projetos.length} projetos; ${mortos} link(s) marcado(s) como indisponível).`);
