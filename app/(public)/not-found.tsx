import type { Metadata } from "next";
import { NaoEncontrado } from "@/app/components/organisms/NaoEncontrado";

export const metadata: Metadata = { title: "Página não encontrada" };

// notFound() dentro da área pública (ex.: notícia inexistente): já estamos no <main> do PortalShell.
export default function NotFoundPublico() {
  return <NaoEncontrado />;
}
