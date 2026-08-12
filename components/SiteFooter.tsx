import { getConfiguracoes } from "@/lib/config-db";

export default async function SiteFooter() {
  const config = await getConfiguracoes();

  return (
    <footer className="hero-night border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand/logo.jpg" alt={config.nomeLoja} className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-display text-base font-bold text-white">{config.nomeLoja}</p>
              {config.textoInstitucional && <p className="mt-0.5 max-w-xs text-xs text-white/50">{config.textoInstitucional}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm text-white/60 sm:items-end">
            {config.endereco && <p>{config.endereco}</p>}
            {config.horarioAtendimento && <p>{config.horarioAtendimento}</p>}
            {config.email && <p>{config.email}</p>}
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
