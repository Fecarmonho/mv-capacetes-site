import type { Metadata } from "next";
import { Rajdhani, Anton, Inter } from "next/font/google";
import "./globals.css";

// Fonte de destaque com cara técnica/racing — títulos de seção, UI do
// admin, botões.
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Fonte de impacto (condensada, bem pesada) — só pros títulos grandes do
// carrossel, no estilo pôster que as vitrines de moto/moda costumam usar.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-impact",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MV Capacetes — Proteção, estilo e atitude",
    template: "%s | MV Capacetes",
  },
  description:
    "Capacetes de moto novos e usados, com procedência e curadoria. Confira nosso catálogo e fale direto com a loja.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${rajdhani.variable} ${anton.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
