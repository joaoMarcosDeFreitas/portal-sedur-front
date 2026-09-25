import { NextResponse } from "next/server";
import { getConsultas } from "@/lib/data/consultas";
import { buscarLegislacao } from "@/lib/data/legislacao";
import { buscarNoticias } from "@/lib/data/noticias";
import { getTodosOsServicos, slugDaCategoria, slugDoServico } from "@/lib/data/servicos";
import { dataCurta } from "@/lib/normalize/data";
import { normalizar } from "@/lib/utils/normalizar";

export interface ResultadoBusca {
  tipo: "secao" | "servico" | "consulta" | "legislacao" | "noticia";
  titulo: string;
  subtitulo?: string;
  href: string;
}

const SECOES: ResultadoBusca[] = [
  { tipo: "secao", titulo: "Serviços", href: "/servicos" },
  { tipo: "secao", titulo: "Legislação", href: "/legislacao" },
  { tipo: "secao", titulo: "Notícias", href: "/noticias" },
  { tipo: "secao", titulo: "Licitações", href: "/licitacoes" },
  { tipo: "secao", titulo: "Transparência", href: "/transparencia" },
  { tipo: "secao", titulo: "Institucional", href: "/institucional" },
  { tipo: "secao", titulo: "Dirigentes", href: "/institucional/dirigentes" },
  { tipo: "secao", titulo: "Estrutura organizacional", href: "/institucional/estrutura-organizacional" },
  { tipo: "secao", titulo: "Consultas", href: "/consultas" },
  { tipo: "secao", titulo: "Formulários", href: "/formularios" },
  { tipo: "secao", titulo: "Canais de atendimento", href: "/canais-de-atendimento" },
  { tipo: "secao", titulo: "Geoserviços", href: "/geoservicos" },
  { tipo: "secao", titulo: "Sistemas parceiros", href: "/sistemas-parceiros" },
  { tipo: "secao", titulo: "Serviços dispensados de licença", href: "/servicos/dispensados-de-licenca" },
  { tipo: "secao", titulo: "Agendamento de atendimento", href: "/agendamento" },
  { tipo: "secao", titulo: "IPTU Verde", href: "/institucional/projetos/iptu-verde" },
  { tipo: "secao", titulo: "Revisão do PDDU", href: "/institucional/projetos/revisao-do-pddu" },
  { tipo: "secao", titulo: "Fiscalização Carnaval 2026", href: "/transparencia/carnaval" },
  { tipo: "secao", titulo: "Áreas de atuação", href: "/institucional/areas-de-atuacao" },
  { tipo: "secao", titulo: "Programas e projetos", href: "/institucional/projetos" },
  { tipo: "secao", titulo: "Audiências públicas", href: "/transparencia/audiencias-publicas" },
  { tipo: "secao", titulo: "Estudos de Impacto de Vizinhança (EIV/RIV)", href: "/transparencia/eiv-riv" },
];

const LIMITE = 10;

export async function GET(request: Request) {
  const bruto = new URL(request.url).searchParams.get("q") ?? "";
  const termo = normalizar(bruto);
  if (!termo) {
    return NextResponse.json({ resultados: [] satisfies ResultadoBusca[] });
  }

  const [servicos, consultas, paineis, legislacao, noticias] = await Promise.all([
    getTodosOsServicos(),
    getConsultas("consulta"),
    getConsultas("transparencia"),
    buscarLegislacao({ q: bruto, porPagina: 2 }),
    buscarNoticias({ q: bruto, porPagina: 2 }),
  ]);

  const secoes = SECOES.filter((secao) => normalizar(secao.titulo).includes(termo));

  const doServicos: ResultadoBusca[] = servicos
    .filter((s) => normalizar(s.nome).includes(termo) || normalizar(s.categoria).includes(termo))
    .slice(0, 4)
    .map((s) => ({
      tipo: "servico",
      titulo: s.nome,
      subtitulo: s.categoria,
      href: `/servicos/${slugDaCategoria({ id: s.categoria_id, nome: s.categoria })}/${slugDoServico(s)}`,
    }));

  const dasConsultas: ResultadoBusca[] = [
    ...consultas.map((c) => ({ c, base: "/consultas", rotulo: "Consulta" })),
    ...paineis.map((c) => ({ c, base: "/transparencia", rotulo: "Transparência" })),
  ]
    .filter(({ c }) => normalizar(c.titulo).includes(termo))
    .slice(0, 2)
    .map(({ c, base, rotulo }) => ({ tipo: "consulta", titulo: c.titulo, subtitulo: rotulo, href: `${base}/${c.slug}` }));

  const daLegislacao: ResultadoBusca[] = legislacao.itens.map((doc) => ({
    tipo: "legislacao",
    titulo: doc.numero || doc.descricao.slice(0, 60),
    subtitulo: `${doc.secao} · ${doc.data}`,
    href: `/legislacao?q=${encodeURIComponent(bruto)}`,
  }));

  const dasNoticias: ResultadoBusca[] = noticias.itens.map((noticia) => ({
    tipo: "noticia",
    titulo: noticia.titulo,
    subtitulo: `Notícia · ${dataCurta(noticia.data)}`,
    href: `/noticias/${noticia.id}`,
  }));

  const resultados = [...secoes.slice(0, 3), ...doServicos, ...dasConsultas, ...daLegislacao, ...dasNoticias].slice(0, LIMITE);
  return NextResponse.json({ resultados } satisfies { resultados: ResultadoBusca[] });
}
