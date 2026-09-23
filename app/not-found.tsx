import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { LinkButton } from "@/app/components/atoms/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 items-center">
      <Container className="py-24 text-center">
        <Text as="p" variant="eyebrow" tone="accent">
          Erro 404
        </Text>
        <Text as="h1" variant="h1" className="mt-3">
          Não encontramos essa página
        </Text>
        <Text tone="muted" className="mx-auto mt-3 max-w-md">
          O endereço pode ter mudado ou o conteúdo não existe mais. Volte para a página inicial ou
          use a busca para encontrar o que precisa.
        </Text>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/">Ir para a página inicial</LinkButton>
          <LinkButton href="/servicos" variant="secondary">
            Ver serviços
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
