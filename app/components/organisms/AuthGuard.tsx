"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { useSessao } from "@/lib/auth/sessao";

/**
 * Protege a área logada do cidadão (a sessão é simulada, ver lib/auth/sessao.ts). Sem sessão,
 * manda para o login guardando a página de origem; se a pessoa sair estando aqui, volta pra home.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { usuario, hidratado } = useSessao();
  const router = useRouter();
  const pathname = usePathname();
  const tinhaSessao = useRef(false);

  useEffect(() => {
    if (!hidratado) return;
    if (usuario) {
      tinhaSessao.current = true;
      return;
    }
    router.replace(tinhaSessao.current ? "/" : `/login?proximo=${encodeURIComponent(pathname)}`);
  }, [hidratado, usuario, router, pathname]);

  if (!hidratado || !usuario) {
    return (
      // É o H1 da página enquanto a sessão é conferida (HTML do servidor e 1ª pintura): assim nenhuma
      // página fica sem título, e o conteúdo real traz o próprio H1 quando aparece.
      <Container className="py-24">
        <Text as="h1" variant="h3" tone="muted">
          Verificando sua sessão…
        </Text>
      </Container>
    );
  }

  return <>{children}</>;
}
