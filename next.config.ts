import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que o Turbopack suba até C:\Users\joaom (há um package-lock.json solto lá,
  // fora deste repositório) procurando a raiz do workspace.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
