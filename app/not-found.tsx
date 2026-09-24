import type { Metadata } from "next";
import { NaoEncontrado } from "@/app/components/organisms/NaoEncontrado";

export const metadata: Metadata = { title: "Página não encontrada" };

// 404 raiz (endereço que não casa com nenhuma rota): aqui não há PortalShell, então esta página
// é o próprio <main>. Dentro da área pública vale `(public)/not-found.tsx`.
export default function NotFound() {
  return (
    <main className="flex min-h-full flex-1 items-center">
      <NaoEncontrado />
    </main>
  );
}
