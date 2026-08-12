import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
