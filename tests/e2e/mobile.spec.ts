import { expect, test } from "@playwright/test";
import { PAGINAS_PUBLICAS } from "./helpers";

// Layout de celular: sem rolagem horizontal na página, alvos de toque e texto de tamanho utilizável.
for (const largura of [360, 390, 768]) {
  test.describe(`largura ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: 800 }, isMobile: true, hasTouch: true });

    for (const url of PAGINAS_PUBLICAS) {
      test(url, async ({ page }) => {
        await page.goto(url);
        await page.locator("h1").first().waitFor();

        const medidas = await page.evaluate(() => {
          const larguraJanela = document.documentElement.clientWidth;
          const transbordo = document.documentElement.scrollWidth - larguraJanela;

          // Alvos de toque: links e botões com menos de 24px (WCAG 2.5.8), exceto links no meio de um texto.
          const pequenos: string[] = [];
          const controles = document.querySelectorAll<HTMLElement>(
            "a[href], button, input:not([type=hidden]), select, summary, [role=option]",
          );
          for (const el of controles) {
            const caixa = el.getBoundingClientRect();
            const estilo = getComputedStyle(el);
            if (caixa.width === 0 || caixa.height === 0 || estilo.visibility === "hidden") continue;
            if (el.closest("[aria-hidden=true], #menu-lateral") || el.classList.contains("sr-only")) continue;
            if (el.tagName === "A" && el.closest("p, li") && estilo.display === "inline") continue;
            if (caixa.width < 24 || caixa.height < 24) {
              pequenos.push(`${el.tagName}[${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}] ${Math.round(caixa.width)}x${Math.round(caixa.height)}`);
            }
          }

          // Texto menor que 11,5px visível.
          const minusculos = new Set<string>();
          for (const el of document.querySelectorAll<HTMLElement>("p, span, a, li, td, th, label, dd, dt, button")) {
            const temTexto = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
            if (!temTexto || el.classList.contains("sr-only") || el.getBoundingClientRect().width === 0) continue;
            const tamanho = parseFloat(getComputedStyle(el).fontSize);
            if (tamanho < 11.5) minusculos.add(`${tamanho}px "${(el.textContent ?? "").trim().slice(0, 25)}"`);
          }
          return { transbordo, pequenos, minusculos: [...minusculos] };
        });

        expect(medidas.transbordo, "rolagem horizontal da página (px)").toBeLessThanOrEqual(0);
        expect(medidas.pequenos, "alvos de toque menores que 24px").toEqual([]);
        expect(medidas.minusculos, "texto menor que 11,5px").toEqual([]);
      });
    }
  });
}

test.describe("celular: rótulos de ícone não quebram no meio da palavra", () => {
  test.use({ viewport: { width: 360, height: 800 }, isMobile: true });

  for (const url of ["/", "/servicos", "/legislacao", "/transparencia", "/institucional", "/institucional/projetos"]) {
    test(url, async ({ page }) => {
      await page.goto(url);
      const largas = await page.evaluate(() => {
        const saida: string[] = [];
        for (const rotulo of document.querySelectorAll<HTMLElement>("main a.group > span:last-child")) {
          const caixa = rotulo.getBoundingClientRect().width;
          const estilo = getComputedStyle(rotulo);
          for (const palavra of (rotulo.textContent ?? "").trim().split(/\s+/)) {
            const medida = document.createElement("span");
            medida.textContent = palavra;
            medida.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
            medida.style.font = estilo.font;
            medida.style.letterSpacing = estilo.letterSpacing;
            document.body.appendChild(medida);
            if (medida.getBoundingClientRect().width > caixa + 0.5) saida.push(palavra);
            medida.remove();
          }
        }
        return saida;
      });
      expect(largas, "palavras mais largas que o ícone").toEqual([]);
    });
  }
});
