import raw from "@/data/formularios.json";
import type { Formulario, FormulariosData } from "@/types/institucional";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as FormulariosData;

export async function getFormularios(): Promise<Formulario[]> {
  await sleep();
  return data.formularios;
}
