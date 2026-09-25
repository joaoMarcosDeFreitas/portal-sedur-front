import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes unitários: só lógica pura (normalização, cálculos, camada de dados). As telas são
// cobertas pelos testes de ponta a ponta em `tests/e2e` (Playwright).
export default defineConfig({
  resolve: {
    // Mesmo atalho "@/" do tsconfig.
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    // `sleep()` (latência simulada) não espera durante o build; aqui também não, para os testes serem rápidos.
    env: { NEXT_PHASE: "phase-production-build" },
  },
});
