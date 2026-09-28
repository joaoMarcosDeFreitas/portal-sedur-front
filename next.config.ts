import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que o Turbopack suba até C:\Users\joaom (há um package-lock.json solto lá,
  // fora deste repositório) procurando a raiz do workspace.
  turbopack: {
    root: __dirname,
  },
  // "Nossos Projetos" saiu de dentro de Institucional e ganhou endereço próprio (/projetos).
  async redirects() {
    return [
      { source: "/institucional/projetos", destination: "/projetos", permanent: true },
      { source: "/institucional/projetos/:slug", destination: "/projetos/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
