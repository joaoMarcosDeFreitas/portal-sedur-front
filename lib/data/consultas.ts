import catalogos from "@/data/consultas-catalogos.json";
import { normalizar } from "@/lib/utils/normalizar";
import { sleep } from "@/lib/utils/sleep";

/**
 * Consultas públicas e painéis de transparência.
 *
 * - As 4 consultas de ATIVIDADES (escritórios virtuais, classificação de risco, autônomos e
 *   residências) usam dados REAIS e completos, extraídos das páginas salvas do portal atual
 *   (`data/consultas-catalogos.json`).
 * - As consultas por número (auto de infração, CGA, solicitação, alvará) e os painéis de
 *   transparência dependem de sistemas internos: seguem o formato do portal atual (campos, botões
 *   e mensagens lidos do código salvo), mas com dados de DEMONSTRAÇÃO fictícios e determinísticos,
 *   sempre sinalizados na tela.
 */

export type Grupo = "consulta" | "transparencia";

/**
 * "catalogo": lista sempre visível, com filtro e paginação (como as consultas de atividades).
 * "busca": só mostra resultado depois de consultar um identificador (auto, CGA, solicitação).
 */
export type ModoConsulta = "catalogo" | "busca";

export interface CampoConsulta {
  id: string;
  rotulo: string;
  placeholder?: string;
  /** Coluna filtrada por este campo ("*" = todas as colunas). */
  coluna: string;
  /** Se existir, o campo vira uma lista de opções. */
  opcoes?: string[];
  /** Identificadores (CGA, nº do auto...) casam pelo valor inteiro, não por trecho. */
  exato?: boolean;
}

export interface ColunaConsulta {
  id: string;
  rotulo: string;
  /** Texto longo: aparece recolhido ("Ver condições") para não estourar a tabela. */
  longa?: boolean;
}

export type LinhaConsulta = Record<string, string>;

export interface ConsultaDef {
  slug: string;
  grupo: Grupo;
  /** Nome no menu e nas listas. */
  titulo: string;
  /** Título da página, quando o portal atual usa outro. */
  tituloPagina?: string;
  descricao: string;
  /** Norma ou observação que o portal atual mostra abaixo do título. */
  referencia?: string;
  modo?: ModoConsulta;
  campos: CampoConsulta[];
  colunas: ColunaConsulta[];
  linhas: LinhaConsulta[];
  botao?: string;
  naoEncontrado?: string;
  /** "real" = dados oficiais do portal atual; "ficticio" (padrão) = demonstração. */
  dados?: "real" | "ficticio";
}

// --- gerador determinístico (mesmos dados a cada carga) ---------------------------------------

function semente(texto: string): () => number {
  let h = 1779033703 ^ texto.length;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 3432918353);
  let s = (h << 13) | (h >>> 19);
  return () => {
    s = Math.imul(s ^ (s >>> 16), 2246822507);
    s = Math.imul(s ^ (s >>> 13), 3266489909);
    return ((s ^= s >>> 16) >>> 0) / 4294967296;
  };
}

const escolher = <T>(lista: T[], r: () => number): T => lista[Math.floor(r() * lista.length)];
const numero = (r: () => number, min: number, max: number) => Math.floor(min + r() * (max - min + 1));
const zeros = (n: number, tamanho: number) => String(n).padStart(tamanho, "0");
const dataAleatoria = (r: () => number, ano0 = 2023, ano1 = 2026) =>
  `${zeros(numero(r, 1, 28), 2)}/${zeros(numero(r, 1, 12), 2)}/${numero(r, ano0, ano1)}`;

const LOGRADOUROS = [
  "Av. Tancredo Neves", "Av. Antônio Carlos Magalhães", "Av. Sete de Setembro", "Av. Oceânica", "Rua Chile",
  "Av. Garibaldi", "Rua da Grécia", "Av. Vasco da Gama", "Av. Luís Viana Filho", "Rua Carlos Gomes",
  "Av. Juracy Magalhães Jr.", "Rua Miguel Calmon",
];
const BAIRROS = [
  "Pituba", "Barra", "Itaigara", "Caminho das Árvores", "Rio Vermelho", "Ondina", "Federação", "Brotas",
  "Stiep", "Pernambués", "Liberdade", "Comércio",
];
const EMPRESAS = [
  "Alfa Comunicação Visual Ltda.", "Brisa Mídia Exterior S.A.", "Comercial Pelourinho Ltda.", "Delta Engenharia Ltda.",
  "Estação Cultural Eventos ME", "Farol Alimentos Ltda.", "Grupo Recôncavo Empreendimentos", "Horizonte Construtora Ltda.",
  "Ilhéus Serviços Ltda.", "Jaguaribe Restaurante ME",
];
const SERVICOS = [
  "Licença para Reforma Simples", "Alvará de Publicidade", "Habite-se", "Licença para Construção",
  "Termo de Viabilidade de Localização", "Autorização para Eventos", "Certidão de Endereço",
];
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function gerar(slug: string, quantidade: number, fabricar: (i: number, r: () => number) => LinhaConsulta): LinhaConsulta[] {
  const r = semente(slug);
  return Array.from({ length: quantidade }, (_, i) => fabricar(i, r));
}

const campoBairro = (): CampoConsulta => ({ id: "bairro", rotulo: "Bairro", coluna: "bairro", opcoes: BAIRROS });

// --- catálogos REAIS das consultas de atividades ------------------------------------------------

/** O portal atual tem alguns valores quebrados no catálogo de risco (ex.: "7490-"): viram "—". */
const limparRisco = (valor?: string) => (!valor || /^\d{4}-/.test(valor) ? "—" : valor.trim());

const CAMPO_FILTRO: CampoConsulta = { id: "filtro", rotulo: "Filtrar", placeholder: "Digite sua busca", coluna: "*" };

const catalogoEscritorios: LinhaConsulta[] = catalogos.escritorios_virtuais.itens.map((item, i) => ({
  id: String(i),
  cnae: item.cnae,
  descricao: item.descricao,
}));

const catalogoRisco: LinhaConsulta[] = catalogos.classificacao_risco.itens.map((item, i) => ({
  id: String(i),
  cnae: item.cnae,
  descricao: item.descricao,
  urbanistico: limparRisco(item.riscoUrbanistico),
  condicionante: (item.condicionante ?? "").trim(),
  sanitario: limparRisco(item.riscoSanitario),
  ambiental: limparRisco(item.riscoAmbiental),
  unificado: limparRisco(item.riscoMunicipal),
}));

const catalogoAutonomos: LinhaConsulta[] = catalogos.atividades_autonomos.itens.map((item, i) => ({
  id: String(i),
  sefaz: item.codigoSefaz,
  descricao: item.descricao,
  cnae: item.cnae,
}));

const catalogoResidencias: LinhaConsulta[] = catalogos.atividades_residencias.itens.map((item, i) => ({
  id: String(i),
  cnae: item.cnae,
  descricao: item.descricao,
}));

const definicoes: ConsultaDef[] = [
  {
    slug: "alvara-de-publicidade",
    grupo: "consulta",
    titulo: "Alvará de Publicidade",
    descricao: "Consulte a situação de um alvará de publicidade pelo número.",
    modo: "busca",
    campos: [{ id: "alvara", rotulo: "Nº do alvará", placeholder: "Ex.: 2024-0412", coluna: "alvara", exato: true }],
    colunas: [
      { id: "alvara", rotulo: "Alvará" }, { id: "empresa", rotulo: "Empresa" }, { id: "tipo", rotulo: "Tipo" },
      { id: "endereco", rotulo: "Endereço" }, { id: "validade", rotulo: "Validade" },
    ],
    naoEncontrado: "Nenhum alvará encontrado para o número informado.",
    linhas: gerar("alvara-de-publicidade", 24, (i, r) => ({
      alvara: `${numero(r, 2022, 2026)}-${zeros(numero(r, 1, 999), 4)}`,
      empresa: escolher(EMPRESAS, r),
      tipo: escolher(["Letreiro", "Painel", "Toldo", "Empena", "Totem"], r),
      endereco: `${escolher(LOGRADOUROS, r)}, ${numero(r, 10, 3200)}`,
      validade: dataAleatoria(r, 2026, 2028),
      id: String(i),
    })),
  },
  {
    slug: "auto-de-infracao",
    grupo: "consulta",
    titulo: "Auto de Infração",
    descricao: "Consulte um auto de infração pelo número.",
    modo: "busca",
    botao: "Pesquisar",
    campos: [{ id: "auto", rotulo: "Número do auto", placeholder: "Ex.: 014582", coluna: "auto", exato: true }],
    colunas: [
      { id: "auto", rotulo: "Auto" }, { id: "data", rotulo: "Data" }, { id: "infracao", rotulo: "Infração" },
      { id: "situacao", rotulo: "Situação" },
    ],
    naoEncontrado: "Nenhum auto de infração encontrado para o número informado.",
    linhas: gerar("auto-de-infracao", 20, (i, r) => ({
      auto: zeros(numero(r, 1000, 99999), 6),
      data: dataAleatoria(r),
      infracao: escolher(["Obra sem licença", "Publicidade irregular", "Ocupação de passeio", "Evento sem alvará"], r),
      situacao: escolher(["Em prazo de defesa", "Multa aplicada", "Regularizado", "Arquivado"], r),
      id: String(i),
    })),
  },
  {
    slug: "atividades-para-escritorios-virtuais",
    grupo: "consulta",
    titulo: "Atividades para Escritórios Virtuais",
    tituloPagina: "Lista de atividades para escritórios virtuais",
    descricao: "Atividades econômicas (CNAE) que podem funcionar como escritório virtual.",
    modo: "catalogo",
    dados: "real",
    campos: [CAMPO_FILTRO],
    colunas: [{ id: "cnae", rotulo: "CNAE" }, { id: "descricao", rotulo: "Atividade" }],
    linhas: catalogoEscritorios,
  },
  {
    slug: "classificacao-de-risco-das-atividades",
    grupo: "consulta",
    titulo: "Classificação de Risco das Atividades Econômicas",
    descricao: "Grau de risco urbanístico, sanitário, ambiental e municipal de cada atividade econômica.",
    referencia: "Decreto nº 38.673/2024",
    modo: "catalogo",
    dados: "real",
    campos: [CAMPO_FILTRO],
    colunas: [
      { id: "cnae", rotulo: "Código CNAE" },
      { id: "descricao", rotulo: "Descrição" },
      { id: "urbanistico", rotulo: "Risco urbanístico" },
      { id: "condicionante", rotulo: "Condicionante para baixo risco A", longa: true },
      { id: "sanitario", rotulo: "Risco sanitário (VISA)" },
      { id: "ambiental", rotulo: "Risco ambiental" },
      { id: "unificado", rotulo: "Risco municipal unificado" },
    ],
    linhas: catalogoRisco,
  },
  {
    slug: "atividades-para-profissionais-autonomos",
    grupo: "consulta",
    titulo: "Atividades Permitidas para Profissionais Autônomos",
    descricao: "Atividades que profissionais autônomos podem exercer, com os códigos Sefaz e CNAE.",
    modo: "catalogo",
    dados: "real",
    campos: [CAMPO_FILTRO],
    colunas: [{ id: "sefaz", rotulo: "Código Sefaz" }, { id: "descricao", rotulo: "Descrição" }, { id: "cnae", rotulo: "Código CNAE" }],
    linhas: catalogoAutonomos,
  },
  {
    slug: "atividades-permitidas-em-residencias",
    grupo: "consulta",
    titulo: "Atividades Permitidas em Residências",
    descricao: "Atividades que podem funcionar dentro de imóveis residenciais.",
    modo: "catalogo",
    dados: "real",
    campos: [CAMPO_FILTRO],
    colunas: [{ id: "cnae", rotulo: "Código CNAE" }, { id: "descricao", rotulo: "Descrição" }],
    linhas: catalogoResidencias,
  },
  {
    slug: "renovacao-de-publicidade-dam",
    grupo: "consulta",
    titulo: "Renovação de Publicidade (DAM)",
    tituloPagina: "Consulta de DAMs em aberto por CGA",
    descricao: "Veja os DAMs em aberto de um CGA, para renovar a publicidade.",
    modo: "busca",
    botao: "Consultar",
    campos: [{ id: "cga", rotulo: "CGA", placeholder: "Ex.: 90147", coluna: "cga", exato: true }],
    colunas: [
      { id: "cga", rotulo: "CGA" }, { id: "dam", rotulo: "DAM" }, { id: "valor", rotulo: "Valor" },
      { id: "vencimento", rotulo: "Vencimento" }, { id: "situacao", rotulo: "Situação" },
    ],
    // Mensagem do portal atual, palavra por palavra.
    naoEncontrado: "Não foi encontrado DAM em aberto para o CGA informado!",
    linhas: gerar("renovacao-de-publicidade-dam", 18, (i, r) => {
      const cga = String(numero(r, 10000, 99999));
      const empresa = escolher(EMPRESAS, r); // consome o sorteio (mantém os mesmos CGAs de antes)
      void empresa;
      const valor = `R$ ${numero(r, 120, 2400).toLocaleString("pt-BR")},${zeros(numero(r, 0, 99), 2)}`;
      const vencimento = dataAleatoria(r, 2026, 2027);
      const numeroDam = (Number(cga) * 37) % 90000 + 10000;
      return {
        id: String(i),
        cga,
        dam: `${numeroDam}/${vencimento.slice(-4)}-${Number(cga) % 10}`,
        valor,
        vencimento,
        situacao: "Em aberto",
      };
    }),
  },
  {
    slug: "solicitacao-de-servicos",
    grupo: "consulta",
    titulo: "Solicitação de Serviços",
    descricao: "Acompanhe uma solicitação pela origem, ano e número do documento.",
    modo: "busca",
    botao: "Consultar",
    campos: [
      { id: "origem", rotulo: "Origem", placeholder: "Ex.: SEDUR", coluna: "origem", exato: true },
      { id: "ano", rotulo: "Ano", placeholder: "Ex.: 2025", coluna: "ano", exato: true },
      { id: "numero", rotulo: "Número", placeholder: "Ex.: 20431", coluna: "documento", exato: true },
    ],
    colunas: [
      { id: "origem", rotulo: "Origem" }, { id: "documento", rotulo: "Número" }, { id: "ano", rotulo: "Ano" },
      { id: "servico", rotulo: "Serviço" }, { id: "situacao", rotulo: "Situação" },
    ],
    naoEncontrado: "Solicitação não encontrada.",
    linhas: gerar("solicitacao-de-servicos", 24, (i, r) => ({
      id: String(i), origem: "SEDUR", documento: String(numero(r, 10000, 99999)), ano: String(numero(r, 2023, 2026)),
      servico: escolher(SERVICOS, r), situacao: escolher(["Em análise", "Aguardando pagamento", "Concluída", "Com pendência"], r),
    })),
  },
  // --- painéis de transparência --------------------------------------------------------------
  {
    slug: "alvara-de-obras-em-vias-e-logradouros",
    grupo: "transparencia",
    titulo: "Alvará de Obras em Vias e Logradouros Públicos",
    descricao: "Obras licenciadas em ruas, calçadas e demais logradouros públicos.",
    campos: [
      { id: "alvara", rotulo: "Nº do alvará", coluna: "alvara" },
      { id: "solicitante", rotulo: "Solicitante", coluna: "solicitante" },
      campoBairro(),
    ],
    colunas: [
      { id: "alvara", rotulo: "Alvará" }, { id: "solicitante", rotulo: "Solicitante" }, { id: "logradouro", rotulo: "Logradouro" },
      { id: "bairro", rotulo: "Bairro" }, { id: "entrada", rotulo: "Entrada" },
    ],
    linhas: gerar("obras-vias", 30, (i, r) => ({
      id: String(i), alvara: `${numero(r, 2024, 2026)}/${zeros(numero(r, 1, 900), 3)}`, solicitante: escolher(EMPRESAS, r),
      logradouro: escolher(LOGRADOUROS, r), bairro: escolher(BAIRROS, r), entrada: dataAleatoria(r),
    })),
  },
  {
    slug: "alvaras-de-construcao-por-mes",
    grupo: "transparencia",
    titulo: "Alvarás de Construção por Mês",
    descricao: "Quantidade de alvarás de construção emitidos em cada mês.",
    campos: [
      { id: "mes", rotulo: "Mês", coluna: "mes", opcoes: MESES },
      { id: "ano", rotulo: "Ano", placeholder: "Ex.: 2025", coluna: "ano" },
    ],
    colunas: [{ id: "mes", rotulo: "Mês" }, { id: "ano", rotulo: "Ano" }, { id: "emitidos", rotulo: "Alvarás emitidos" }, { id: "area", rotulo: "Área licenciada (m²)" }],
    linhas: gerar("alvaras-mes", 36, (i, r) => ({
      id: String(i), mes: MESES[i % 12], ano: String(2024 + Math.floor(i / 12)),
      emitidos: String(numero(r, 40, 210)), area: numero(r, 8000, 90000).toLocaleString("pt-BR"),
    })),
  },
  {
    slug: "alvaras-de-habite-se",
    grupo: "transparencia",
    titulo: "Alvarás de Habite-se Concedidos",
    descricao: "Habite-ses concedidos, por número, alvará de origem ou endereço.",
    campos: [
      { id: "habitese", rotulo: "Nº do habite-se", coluna: "habitese" },
      { id: "logradouro", rotulo: "Logradouro", coluna: "endereco" },
    ],
    colunas: [{ id: "habitese", rotulo: "Habite-se" }, { id: "alvara", rotulo: "Alvará de construção" }, { id: "endereco", rotulo: "Endereço" }, { id: "data", rotulo: "Concessão" }],
    linhas: gerar("habitese", 30, (i, r) => ({
      id: String(i), habitese: `${numero(r, 2024, 2026)}-${zeros(numero(r, 1, 999), 3)}`, alvara: `${numero(r, 2020, 2025)}/${zeros(numero(r, 1, 900), 3)}`,
      endereco: `${escolher(LOGRADOUROS, r)}, ${numero(r, 10, 2900)}`, data: dataAleatoria(r),
    })),
  },
  {
    slug: "analise-de-orientacao-previa-aop",
    grupo: "transparencia",
    titulo: "Análise de Orientação Prévia (AOP) Emitidas",
    descricao: "Análises de Orientação Prévia emitidas, por endereço e período.",
    campos: [{ id: "logradouro", rotulo: "Logradouro", coluna: "endereco" }, campoBairro()],
    colunas: [{ id: "protocolo", rotulo: "Protocolo" }, { id: "endereco", rotulo: "Endereço" }, { id: "bairro", rotulo: "Bairro" }, { id: "emissao", rotulo: "Emissão" }],
    linhas: gerar("aop", 28, (i, r) => ({
      id: String(i), protocolo: `AOP-${numero(r, 2024, 2026)}-${zeros(numero(r, 1, 700), 3)}`,
      endereco: `${escolher(LOGRADOUROS, r)}, ${numero(r, 10, 2900)}`, bairro: escolher(BAIRROS, r), emissao: dataAleatoria(r),
    })),
  },
  {
    slug: "estudo-de-impacto-de-vizinhanca-eiv",
    grupo: "transparencia",
    titulo: "Estudo de Impacto de Vizinhança (EIV)",
    descricao: "Processos de licenciamento com Estudo de Impacto de Vizinhança.",
    campos: [{ id: "processo", rotulo: "Processo", coluna: "processo" }, campoBairro()],
    colunas: [{ id: "processo", rotulo: "Processo" }, { id: "empreendimento", rotulo: "Empreendimento" }, { id: "bairro", rotulo: "Bairro" }, { id: "situacao", rotulo: "Situação" }],
    linhas: gerar("eiv", 14, (i, r) => ({
      id: String(i), processo: `${numero(r, 2019, 2025)}-${zeros(numero(r, 1, 9999), 4)}`, empreendimento: `Residencial ${escolher(["Aurora", "Farol", "Jardins", "Mirante", "Parque"], r)}`,
      bairro: escolher(BAIRROS, r), situacao: escolher(["Em análise", "Audiência realizada", "Aprovado com condicionantes"], r),
    })),
  },
  {
    slug: "eventos-licenciados",
    grupo: "transparencia",
    titulo: "Eventos Licenciados",
    descricao: "Eventos com licença da SEDUR, por mês e ano.",
    campos: [
      { id: "mes", rotulo: "Mês", coluna: "mes", opcoes: MESES },
      { id: "ano", rotulo: "Ano", placeholder: "Ex.: 2026", coluna: "ano" },
    ],
    colunas: [{ id: "evento", rotulo: "Evento" }, { id: "local", rotulo: "Local" }, { id: "mes", rotulo: "Mês" }, { id: "ano", rotulo: "Ano" }],
    linhas: gerar("eventos", 30, (i, r) => ({
      id: String(i), evento: `${escolher(["Festival", "Feira", "Show", "Corrida", "Encontro"], r)} ${escolher(["do Bem-Estar", "Gastronômico", "de Verão", "Cultural", "do Comércio"], r)}`,
      local: `${escolher(LOGRADOUROS, r)} — ${escolher(BAIRROS, r)}`, mes: escolher(MESES, r), ano: String(numero(r, 2025, 2026)),
    })),
  },
  {
    slug: "processos-em-convite",
    grupo: "transparencia",
    titulo: "Processos em Convite",
    descricao: "Processos que aguardam atendimento a convite (pendências do requerente).",
    campos: [{ id: "grupo", rotulo: "Grupo de serviço", coluna: "servico", opcoes: SERVICOS }],
    colunas: [{ id: "processo", rotulo: "Processo" }, { id: "servico", rotulo: "Serviço" }, { id: "convocado", rotulo: "Convocado em" }, { id: "prazo", rotulo: "Prazo" }],
    linhas: gerar("convite", 22, (i, r) => ({
      id: String(i), processo: `${numero(r, 2025, 2026)}-${zeros(numero(r, 1, 9999), 4)}`, servico: escolher(SERVICOS, r),
      convocado: dataAleatoria(r, 2026, 2026), prazo: `${numero(r, 5, 30)} dias`,
    })),
  },
];

export async function getConsultas(grupo: Grupo): Promise<ConsultaDef[]> {
  await sleep();
  return definicoes.filter((def) => def.grupo === grupo);
}

export async function getConsultaPorSlug(grupo: Grupo, slug: string): Promise<ConsultaDef | undefined> {
  await sleep();
  return definicoes.find((def) => def.grupo === grupo && def.slug === slug);
}

/** Aplica os filtros informados (cada campo filtra a sua coluna, sem exigir acento). */
export function filtrarLinhas(def: ConsultaDef, valores: Record<string, string>): LinhaConsulta[] {
  return def.linhas.filter((linha) =>
    def.campos.every((campo) => {
      const digitado = normalizar(valores[campo.id] ?? "");
      if (!digitado) return true;
      // "*" procura em todas as colunas exibidas (filtro geral das consultas de atividades).
      const alvo = normalizar(
        campo.coluna === "*" ? def.colunas.map((c) => linha[c.id] ?? "").join(" ") : (linha[campo.coluna] ?? ""),
      );
      return campo.exato ? alvo === digitado : alvo.includes(digitado);
    }),
  );
}
