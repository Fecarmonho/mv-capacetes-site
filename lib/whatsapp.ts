export function buildWhatsappUrl(numero: string, mensagem: string): string {
  const digits = numero.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(mensagem)}`;
}
