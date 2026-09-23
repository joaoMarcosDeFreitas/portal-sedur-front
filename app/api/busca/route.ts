import { NextResponse } from "next/server";
import { getTodosOsServicos, slugDaCategoria, slugDoServico } from "@/lib/data/servicos";
import { normalizar } from "@/lib/utils/normalizar";

export interface ResultadoBusca {
  tipo: "secao" | "servico";
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
  { tipo: "secao", titulo: "Formulários", href: "/formularios" },
];

const LIMITE = 8;

export async function GET(request: Request) {
  const termo = normalizar(new URL(request.url).searchParams.get("q") ?? "");
  if (!termo) {
    return NextResponse.json({ resultados: [] satisfies ResultadoBusca[] });
  }

  const secoes = SECOES.filter((secao) => normalizar(secao.titulo).includes(termo));

  const servicos = await getTodosOsServicos();
  const resultadosServicos: ResultadoBusca[] = servicos
    .filter(
      (servico) => normalizar(servico.nome).includes(termo) || normalizar(servico.categoria).includes(termo),
    )
    .slice(0, LIMITE)
    .map((servico) => ({
      tipo: "servico",
      titulo: servico.nome,
      subtitulo: servico.categoria,
      href: `/servicos/${slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria })}/${slugDoServico(servico)}`,
    }));

  const resultados = [...secoes, ...resultadosServicos].slice(0, LIMITE);
  return NextResponse.json({ resultados } satisfies { resultados: ResultadoBusca[] });
}
