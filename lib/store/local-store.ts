/**
 * Store mínimo persistido em localStorage, pensado para `useSyncExternalStore`.
 * Serve de "banco de dados" do mock (sessão e solicitações): sobrevive a refresh e
 * sincroniza entre abas. Se o localStorage estiver indisponível (navegação privada), o
 * valor continua valendo em memória durante a sessão da aba.
 */
export function createLocalStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let current: T | undefined;
  let carregado = false;

  function getSnapshot(): T {
    if (!carregado) {
      try {
        const bruto = localStorage.getItem(key);
        current = bruto ? (JSON.parse(bruto) as T) : fallback;
      } catch {
        current = fallback;
      }
      carregado = true;
    }
    return current as T;
  }

  function getServerSnapshot(): T {
    return fallback;
  }

  function set(proximo: T) {
    current = proximo;
    carregado = true;
    try {
      localStorage.setItem(key, JSON.stringify(proximo));
    } catch {
      // sem persistência: fica só em memória
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const aoMudarEmOutraAba = (evento: StorageEvent) => {
      if (evento.key === key) {
        carregado = false;
        listener();
      }
    };
    window.addEventListener("storage", aoMudarEmOutraAba);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", aoMudarEmOutraAba);
    };
  }

  return { getSnapshot, getServerSnapshot, subscribe, set };
}
