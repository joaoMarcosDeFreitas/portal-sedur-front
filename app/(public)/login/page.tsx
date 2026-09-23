import type { Metadata } from "next";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { LoginForm } from "@/app/components/organisms/LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse suas solicitações de serviço da SEDUR.",
};

/** Só aceita caminhos internos ("/algo"), nunca URLs externas ou "//host" (open redirect). */
function destinoSeguro(proximo: string | string[] | undefined): string {
  const valor = Array.isArray(proximo) ? proximo[0] : proximo;
  return valor && valor.startsWith("/") && !valor.startsWith("//") ? valor : "/minhas-solicitacoes";
}

export default async function LoginPage(props: PageProps<"/login">) {
  const { proximo } = await props.searchParams;

  return (
    <Container className="py-12">
      <div className="max-w-xl">
        <Text as="h1" variant="h1">
          Entrar
        </Text>
        <Text tone="muted" className="mt-3">
          Para solicitar serviços e acompanhar seus processos, escolha um perfil de demonstração.
        </Text>
        <Text variant="small" tone="muted" className="mt-2">
          Ambiente de demonstração: nenhum dado real é solicitado e nenhuma senha é necessária.
        </Text>
        <LoginForm destino={destinoSeguro(proximo)} />
      </div>
    </Container>
  );
}
