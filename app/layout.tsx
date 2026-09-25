import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { VLibras } from "@/app/components/organisms/VLibras";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const valleySans = localFont({
  src: "./fonts/ValleySans-VariableFont_wght.ttf",
  variable: "--font-valley-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Portal SEDUR",
    template: "%s | Portal SEDUR",
  },
  description: "Portal de informações, serviços, legislação e desenvolvimento urbano de Salvador.",
};

// Aplica o tema e as preferências de acessibilidade salvos antes da primeira pintura, pra página não piscar ao carregar.
const SCRIPT_TEMA = `
try {
  var tema = localStorage.getItem("portal-sedur:tema");
  if (!tema) tema = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", tema);
} catch (e) {}
try {
  var p = JSON.parse(localStorage.getItem("portal-sedur:acessibilidade") || "null");
  if (p) {
    var h = document.documentElement;
    if (p.texto) h.setAttribute("data-text-size", p.texto);
    if (p.cinza) h.setAttribute("data-cinza", "1");
    if (p.contraste) h.setAttribute("data-contraste", "alto");
    if (p.sublinhados) h.setAttribute("data-links", "sublinhados");
    if (p.fonteLegivel) h.setAttribute("data-fonte", "legivel");
  }
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${poppins.variable} ${valleySans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <VLibras />
      </body>
    </html>
  );
}
