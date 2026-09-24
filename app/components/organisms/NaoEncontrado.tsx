import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { LinkButton } from "@/app/components/atoms/Button";

/**
 * Conteúdo da página "não encontrada". Fica separado porque é usado em dois lugares com landmarks
 * diferentes: na 404 raiz (sem o shell do portal, que precisa do próprio <main>) e na 404 da área
 * pública (dentro do <main> do PortalShell, onde um segundo <main> seria inválido).
 */
export function NaoEncontrado() {
  return (
    <Container className="py-24 text-center">
      <Text as="p" variant="eyebrow" tone="accent">
        Erro 404
      </Text>
      <Text as="h1" variant="h1" className="mt-3">
        Não encontramos essa página
      </Text>
      <Text tone="muted" className="mx-auto mt-3 max-w-md">
        O endereço pode ter mudado ou o conteúdo não existe mais. Volte para a página inicial ou use a busca para
        encontrar o que precisa.
      </Text>
      <div className="mt-8 flex justify-center gap-3">
        <LinkButton href="/">Ir para a página inicial</LinkButton>
        <LinkButton href="/servicos" variant="secondary">
          Ver serviços
        </LinkButton>
      </div>
    </Container>
  );
}
