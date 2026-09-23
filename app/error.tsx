"use client";

import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Button, LinkButton } from "@/app/components/atoms/Button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-full flex-1 items-center">
      <Container className="py-24 text-center">
        <Text as="p" variant="eyebrow" tone="accent">
          Erro inesperado
        </Text>
        <Text as="h1" variant="h1" className="mt-3">
          Algo deu errado por aqui
        </Text>
        <Text tone="muted" className="mx-auto mt-3 max-w-md">
          Tente novamente em instantes. Se o problema continuar, volte para a página inicial.
        </Text>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Tentar novamente</Button>
          <LinkButton href="/" variant="secondary">
            Página inicial
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
