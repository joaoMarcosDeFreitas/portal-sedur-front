"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, UserRound } from "lucide-react";
import { Text } from "@/app/components/atoms/Text";
import { PERFIS_DEMONSTRACAO, useSessao, type Usuario } from "@/lib/auth/sessao";

/** Login de demonstração: escolhe um perfil fictício, sem senha nem dado real. */
export function LoginForm({ destino }: { destino: string }) {
  const { usuario, hidratado, entrar } = useSessao();
  const router = useRouter();

  useEffect(() => {
    if (hidratado && usuario) router.replace(destino);
  }, [hidratado, usuario, destino, router]);

  function escolher(perfil: Usuario) {
    entrar(perfil);
    router.push(destino);
  }

  return (
    <div className="mt-8 flex flex-col gap-3">
      {PERFIS_DEMONSTRACAO.map((perfil) => {
        const pessoaFisica = perfil.tipo === "pessoa-fisica";
        return (
          <button
            key={perfil.nome}
            type="button"
            onClick={() => escolher(perfil)}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border-strong bg-surface p-4 text-left transition-colors hover:border-primary-400 hover:bg-primary-600/5"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-600/10 text-brand">
              {pessoaFisica ? (
                <UserRound className="size-5" aria-hidden="true" />
              ) : (
                <Building2 className="size-5" aria-hidden="true" />
              )}
            </span>
            <span>
              <Text as="span" className="block font-medium">
                {perfil.nome}
              </Text>
              <Text as="span" variant="small" tone="muted" className="block">
                {pessoaFisica ? "Pessoa física" : "Pessoa jurídica"} · {perfil.documento}
              </Text>
            </span>
          </button>
        );
      })}
    </div>
  );
}
