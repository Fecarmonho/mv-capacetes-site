import Link from "next/link";
import MobileNav from "@/components/MobileNav";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/capacetes", label: "Todos" },
  { href: "/capacetes?tipo=novo", label: "Novos" },
  { href: "/capacetes?tipo=usado", label: "Usados" },
];

export default function SiteHeader() {
  return (
    <header className="hero-night sticky top-0 z-40 border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <img src="/brand/logo.jpg" alt="MV Capacetes" className="h-11 w-11 rounded-full ring-2 ring-blue-light/25" />
          <span className="font-display text-lg font-bold text-white">
            MV <span className="text-blue-light">Capacetes</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-white/70 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/capacetes" className="btn-blue rounded-full px-5 py-2 text-sm font-bold text-white">
            Ver capacetes
          </Link>
        </div>

        <MobileNav links={LINKS} />
      </div>
    </header>
  );
}
