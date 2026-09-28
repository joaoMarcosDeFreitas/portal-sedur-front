/**
 * Regras do botão "Voltar": de onde a pessoa veio (pilha de páginas desta aba) e, quando ela abriu a
 * página direto por um link, para qual página "de cima" ela volta.
 */

const CHAVE = "portal-sedur:pilha";
const LIMITE = 60;

function ler(): string[] {
  try {
    const bruto = sessionStorage.getItem(CHAVE);
    const lista: unknown = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function gravar(pilha: string[]) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(pilha.slice(-LIMITE)));
  } catch {
    // sem sessionStorage: o botão cai no "página de cima", que sempre funciona
  }
}

/**
 * Registra a página aberta e devolve a pilha. Se a página atual é a anterior da pilha, a pessoa voltou
 * (botão do navegador ou o nosso) e a última é descartada; se é a mesma da última, nada muda (recarregar).
 */
export function registrarPagina(atual: string): string[] {
  const pilha = ler();
  if (pilha[pilha.length - 1] === atual) return pilha;
  if (pilha[pilha.length - 2] === atual) pilha.pop();
  else pilha.push(atual);
  gravar(pilha);
  return pilha;
}

/** Detalhes que guardam na URL os filtros da lista de origem: ao voltar por aqui, os filtros voltam junto. */
const DETALHE_COM_FILTROS = /^\/(consultas|transparencia)\/.+\/.+$/;

/** Página "de cima": a que a pessoa esperaria ao subir um nível. */
export function paginaDeCima(caminho: string, busca: string): string {
  const partes = caminho.split("/").filter(Boolean);
  if (partes.length <= 1) return "/";
  if (partes[0] === "solicitar") return "/servicos";
  const pai = `/${partes.slice(0, -1).join("/")}`;
  return DETALHE_COM_FILTROS.test(caminho) ? `${pai}${busca}` : pai;
}
