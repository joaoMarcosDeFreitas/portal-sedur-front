import { NextResponse } from "next/server";
import { buscarLegislacao } from "@/lib/data/legislacao";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const pagina = Math.max(1, Number(params.get("pagina")) || 1);
  const resposta = await buscarLegislacao({
    q: params.get("q") ?? "",
    secao: params.get("secao") || undefined,
    subsecao: params.get("subsecao") || undefined,
    pagina,
  });
  return NextResponse.json(resposta);
}
