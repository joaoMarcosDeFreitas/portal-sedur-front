import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

// Aplica o tema salvo antes da primeira pintura, pra não piscar claro->escuro ao carregar.
const SCRIPT_TEMA = `
try {
  var tema = localStorage.getItem("portal-sedur:tema");
  if (!tema) tema = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", tema);
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
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
