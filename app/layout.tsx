import type { Metadata } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";

// Fonte de destaque com cara técnica/racing (usada em títulos) — pesos
// mais pesados pra aguentar o efeito 3D sem ficar fina/genérica.
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
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
    <html lang="pt-BR" className={`${rajdhani.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
