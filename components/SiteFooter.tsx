import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { getConfiguracoes } from "@/lib/config-db";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export default async function SiteFooter() {
  const config = await getConfiguracoes();

  return (
    <footer className="hero-night border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand/logo.jpg" alt={config.nomeLoja} className="h-11 w-11 rounded-full ring-2 ring-blue-light/25" />
            <div>
              <p className="font-display text-base font-bold text-white">{config.nomeLoja}</p>
              {config.textoInstitucional && <p className="mt-0.5 max-w-xs text-xs text-white/50">{config.textoInstitucional}</p>}
            </div>
          </div>

          {(config.instagram || config.whatsapp) && (
            <div className="flex items-center gap-3">
              {config.instagram && (
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-blue-light hover:text-blue-light"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
              )}
              {config.whatsapp && (
                <a
                  href={buildWhatsappUrl(config.whatsapp, "Olá! Vim pelo site da MV Capacetes 🏍️")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#25D366] hover:text-[#25D366]"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {config.nomeLoja}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
