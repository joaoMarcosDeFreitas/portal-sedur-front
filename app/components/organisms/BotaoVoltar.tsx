"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { paginaDeCima, registrarPagina } from "@/lib/navegacao/voltar";

/**
 * "Voltar" no topo de toda página (menos a inicial): leva à página em que a pessoa estava. Se ela abriu
 * a página direto por um link (não há de onde voltar neste portal), leva à página de cima (ex.: ficha → categoria).
 */
export function BotaoVoltar() {
  const caminho = usePathname();
  const busca = useSearchParams().toString();
  const router = useRouter();
  const [temAnterior, setTemAnterior] = useState(false);
  const atual = busca ? `${caminho}?${busca}` : caminho;

  useEffect(() => {
    // Lê a pilha guardada na aba (só existe no navegador), por isso o estado é acertado depois da 1ª pintura.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTemAnterior(registrarPagina(atual).length > 1);
  }, [atual]);

  if (caminho === "/") return null;

  function voltar() {
    if (temAnterior) router.back();
    else router.push(paginaDeCima(caminho, busca ? `?${busca}` : ""));
  }

  return (
    <div className="mx-auto -mb-4 w-full max-w-6xl px-4 pt-5 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={voltar}
        className="toque cursor-pointer gap-1.5 rounded-lg text-sm font-medium text-brand hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </button>
    </div>
  );
}
