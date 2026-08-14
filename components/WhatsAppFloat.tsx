import { FaWhatsapp } from "react-icons/fa";
import { getConfiguracoes } from "@/lib/config-db";
import { buildWhatsappUrl } from "@/lib/whatsapp";

/** Botão fixo no canto da tela, em toda página do site — mesmo recurso
 * (e mesmo objetivo: contato rápido sem sair da página) que o "WPP FLOAT"
 * do fitmgwear-site. Some se a loja não tiver WhatsApp configurado. */
export default async function WhatsAppFloat() {
  const config = await getConfiguracoes();
  if (!config.whatsapp) return null;

  const url = buildWhatsappUrl(config.whatsapp, "Olá! Vim pelo site da MV Capacetes 🏍️");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform hover:scale-105"
    >
      <FaWhatsapp className="h-7 w-7" />
      <span className="absolute right-16 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-card group-hover:block">
        Fale conosco agora!
      </span>
    </a>
  );
}
