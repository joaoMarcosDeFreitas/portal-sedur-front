"use client";

import Script from "next/script";

declare global {
  interface Window {
    VLibras?: { Widget: new (endereco: string) => unknown };
  }
}

const ENDERECO = "https://vlibras.gov.br/app";

/**
 * VLibras: o tradutor de Português para Libras do governo federal (o mesmo widget do portal atual). O botão
 * flutuante aparece no canto da tela e o script é carregado só depois que a página termina de carregar, sem
 * atrasar nada. Pode ser desligado com `NEXT_PUBLIC_VLIBRAS=off` (os testes automatizados fazem isso, para não
 * depender de um serviço externo nem misturar o conteúdo dele na verificação de acessibilidade da página).
 */
export function VLibras() {
  if (process.env.NEXT_PUBLIC_VLIBRAS === "off") return null;

  return (
    <>
      {/* Estrutura pedida pelo widget (atributos vw, vw-access-button e vw-plugin-wrapper). */}
      <div {...{ vw: "" }} className="enabled">
        <div {...{ "vw-access-button": "" }} className="active" />
        <div {...{ "vw-plugin-wrapper": "" }}>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        src={`${ENDERECO}/vlibras-plugin.js`}
        strategy="lazyOnload"
        onLoad={() => {
          if (window.VLibras) new window.VLibras.Widget(ENDERECO);
        }}
      />
    </>
  );
}
