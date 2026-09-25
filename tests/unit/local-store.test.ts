import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLocalStore } from "@/lib/store/local-store";

describe("createLocalStore", () => {
  const memoria = new Map<string, string>();
  const ouvintesJanela = new Map<string, (e: StorageEvent) => void>();

  beforeEach(() => {
    memoria.clear();
    ouvintesJanela.clear();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => memoria.get(k) ?? null,
      setItem: (k: string, v: string) => void memoria.set(k, v),
    });
    vi.stubGlobal("window", {
      addEventListener: (tipo: string, fn: (e: StorageEvent) => void) => ouvintesJanela.set(tipo, fn),
      removeEventListener: (tipo: string) => void ouvintesJanela.delete(tipo),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("começa no valor padrão e o servidor sempre enxerga o padrão", () => {
    const store = createLocalStore<string[]>("k1", []);
    expect(store.getSnapshot()).toEqual([]);
    expect(store.getServerSnapshot()).toEqual([]);
  });

  it("guarda, persiste em JSON e avisa quem está ouvindo", () => {
    const store = createLocalStore<number[]>("k2", []);
    const avisos = vi.fn();
    const cancelar = store.subscribe(avisos);
    store.set([1, 2]);
    expect(store.getSnapshot()).toEqual([1, 2]);
    expect(memoria.get("k2")).toBe("[1,2]");
    expect(avisos).toHaveBeenCalledTimes(1);
    cancelar();
    store.set([3]);
    expect(avisos).toHaveBeenCalledTimes(1);
  });

  it("lê o que já estava salvo (sobrevive ao recarregar)", () => {
    memoria.set("k3", JSON.stringify({ nome: "Maria" }));
    expect(createLocalStore("k3", { nome: "" }).getSnapshot()).toEqual({ nome: "Maria" });
  });

  it("JSON corrompido cai no padrão em vez de quebrar", () => {
    memoria.set("k4", "{isso não é json");
    expect(createLocalStore("k4", ["ok"]).getSnapshot()).toEqual(["ok"]);
  });

  it("sem localStorage (navegação privada) continua funcionando em memória", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => { throw new Error("bloqueado"); },
      setItem: () => { throw new Error("bloqueado"); },
    });
    const store = createLocalStore<string>("k5", "vazio");
    expect(store.getSnapshot()).toBe("vazio");
    store.set("valor");
    expect(store.getSnapshot()).toBe("valor");
  });

  it("mudança em outra aba (evento storage) recarrega o valor", () => {
    const store = createLocalStore<string>("k6", "a");
    const avisos = vi.fn();
    store.subscribe(avisos);
    expect(store.getSnapshot()).toBe("a");
    memoria.set("k6", JSON.stringify("b"));
    ouvintesJanela.get("storage")!({ key: "k6" } as StorageEvent);
    expect(avisos).toHaveBeenCalled();
    expect(store.getSnapshot()).toBe("b");
  });
});
