import Link from "next/link";
import { Container } from "@/app/components/atoms/Container";

const ATENDIMENTO = [
  { rotulo: "Canais de atendimento", href: "/canais-de-atendimento" },
  { rotulo: "Formulários", href: "/formularios" },
  { rotulo: "Acesso interno (rede SEDUR)", href: "https://sedur.salvador.ba.gov.br/acessoremoto/" },
];

export function Footer() {
  return (
    <footer className="mt-16">
      <Container className="flex flex-col items-center jus gap-10 py-12 text-center md:flex-row md:gap-50">
        <div className="max-w-3xl">
          <p className="font-display text-lg font-semibold text-brand">Portal SEDUR</p>
          <p className="mt-2 text-sm text-foreground-muted">
            Secretaria Municipal de Desenvolvimento Urbano de Salvador
          </p>
          <p className="mt-4 text-sm text-foreground-muted">
            Av. ACM, nº 3224, Caminho das Árvores — Salvador/BA · Seg. a sex., 9h às 16h
          </p>
        </div>

        <nav aria-label="Atendimento" className="flex flex-col items-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Atendimento</p>
          <ul className="mt-3 flex flex-col items-center gap-2 text-sm">
            {ATENDIMENTO.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="cursor-pointer text-foreground-muted hover:text-brand hover:underline">
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div>
        <Container className="py-4 text-center text-xs text-foreground-muted">
          © {new Date().getFullYear()} SEDUR — Prefeitura Municipal de Salvador. Todos os direitos reservados.
        </Container>
      </div>
    </footer>
  );
}
