import Link from "next/link";
import { Marca } from "@/lib/types";

export default function BrandCards({ marcas }: { marcas: Marca[] }) {
  if (marcas.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Marcas</h2>
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {marcas.map((m) => (
          <Link
            key={m.slug}
            href={`/capacetes?marca=${encodeURIComponent(m.nome)}`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-ink/8 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover sm:p-5"
          >
            {m.logo ? (
              <img src={m.logo} alt={m.nome} className="h-10 w-full object-contain grayscale transition-all group-hover:grayscale-0 sm:h-12" />
            ) : (
              <span className="font-display text-sm font-bold text-ink/60 group-hover:text-blue">{m.nome}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
