import raw from "@/data/formularios.json";
import type { Formulario, FormulariosData } from "@/types/institucional";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as FormulariosData;

/** Lista de formulários sem títulos repetidos (o portal atual mostra 55 linhas para 53 formulários). */
export async function getFormularios(): Promise<Formulario[]> {
  await sleep();
  const vistos = new Set<string>();
  return data.formularios
    .filter((formulario) => {
      const chave = formulario.titulo.trim().toLowerCase();
      if (vistos.has(chave)) return false;
      vistos.add(chave);
      return true;
    })
    .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
}
