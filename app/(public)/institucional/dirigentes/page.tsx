import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Breadcrumb } from "@/app/components/molecules/Breadcrumb";
import { getDirigentes } from "@/lib/data/institucional";
import { iniciais } from "@/lib/normalize/institucional";

export const metadata: Metadata = {
  title: "Dirigentes",
  description: "Quem dirige a Secretaria Municipal de Desenvolvimento Urbano de Salvador.",
};

export default async function DirigentesPage() {
  const [secretario, ...demais] = await getDirigentes();

  return (
    <Container className="py-12">
      <Breadcrumb itens={[{ rotulo: "Institucional", href: "/institucional" }, { rotulo: "Dirigentes" }]} />
      <Text as="h1" variant="h1" className="mt-6">
        Dirigentes
      </Text>

      {secretario && (
        <div className="mt-8 flex items-center gap-5">
          <span
            aria-hidden="true"
            className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary-600 font-heading text-2xl font-semibold text-neutral-50"
          >
            {iniciais(secretario.nomes[0])}
          </span>
          <div>
            <Text variant="small" tone="muted">
              {secretario.cargo}
            </Text>
            <Text as="p" variant="h3" className="mt-1">
              {secretario.nomes.join(" / ")}
            </Text>
          </div>
        </div>
      )}

      <ul className="-mx-4 mt-10 grid max-w-4xl gap-x-6 sm:grid-cols-2">
        {demais.map((dirigente) => (
          <li key={dirigente.cargo} className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-surface-muted">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-600/10 text-sm font-semibold text-brand"
            >
              {iniciais(dirigente.nomes[0])}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{dirigente.nomes.join(" / ")}</p>
              <p className="text-sm text-foreground-muted">{dirigente.cargo}</p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
