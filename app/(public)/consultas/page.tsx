import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { getConsultas } from "@/lib/data/consultas";

export const metadata: Metadata = {
  title: "Consultas",
  description: "Consultas públicas da SEDUR: alvarás, autos de infração, atividades permitidas e mais.",
};

export default async function ConsultasPage() {
  const consultas = await getConsultas("consulta");

  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Consultas
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Consulte alvarás, autos, atividades permitidas e o andamento de solicitações sem precisar entrar.
      </Text>
      <ul className="-mx-4 mt-8 flex max-w-3xl flex-col">
        {consultas.map((consulta) => (
          <li key={consulta.slug}>
            <Link
              href={`/consultas/${consulta.slug}`}
              className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-surface-muted"
            >
              <span>
                <span className="block font-medium text-foreground">{consulta.titulo}</span>
                <span className="mt-0.5 block text-sm text-foreground-muted">{consulta.descricao}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-foreground-muted group-hover:text-brand" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
