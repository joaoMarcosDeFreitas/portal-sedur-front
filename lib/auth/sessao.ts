import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/store/local-store";

export interface Usuario {
  nome: string;
  /** Documento já mascarado — o mock nunca guarda CPF/CNPJ real. */
  documento: string;
  tipo: "pessoa-fisica" | "pessoa-juridica";
}

/** Perfis fictícios da tela de login de demonstração. */
export const PERFIS_DEMONSTRACAO: Usuario[] = [
  { nome: "Maria Souza", documento: "CPF ***.482.117-**", tipo: "pessoa-fisica" },
  { nome: "Construtora Exemplo Ltda.", documento: "CNPJ **.315.902/0001-**", tipo: "pessoa-juridica" },
];

const store = createLocalStore<Usuario | null>("portal-sedur:sessao", null);
const semAssinatura = () => () => {};

export function useSessao() {
  const usuario = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  // false no servidor e na hidratação, true depois: evita agir (ex.: redirecionar) antes de
  // saber se existe sessão salva.
  const hidratado = useSyncExternalStore(semAssinatura, () => true, () => false);

  return {
    usuario,
    hidratado,
    entrar: (novo: Usuario) => store.set(novo),
    sair: () => store.set(null),
  };
}
