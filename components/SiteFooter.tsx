import { getConfiguracoes } from "@/lib/config-db";

export default async function SiteFooter() {
  const config = await getConfiguracoes();

  return (
    <footer className="hero-night border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center gap-3">
          <img src="/brand/logo.jpg" alt={config.nomeLoja} className="h-11 w-11 rounded-full ring-2 ring-blue-light/25" />
          <div>
            <p className="font-display text-base font-bold text-white">{config.nomeLoja}</p>
            {config.textoInstitucional && <p className="mt-0.5 max-w-xs text-xs text-white/50">{config.textoInstitucional}</p>}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {config.nomeLoja}. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            {config.instagram && (
              <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            )}
            {config.whatsapp && (
              <a href={`https://wa.me/${config.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
