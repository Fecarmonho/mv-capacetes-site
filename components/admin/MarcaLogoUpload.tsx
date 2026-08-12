"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processarFoto } from "@/lib/image-compress";

export default function MarcaLogoUpload({ slug }: { slug: string }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setEnviando(true);
    setError(null);
    try {
      const { mini } = await processarFoto(file);
      const response = await fetch(`/api/admin/marcas/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: mini }),
      });
      if (!response.ok) throw new Error("Não foi possível salvar a logo.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar a logo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <label className="cursor-pointer text-[11px] font-semibold text-blue hover:underline">
      {enviando ? "Enviando..." : "Trocar logo"}
      <input type="file" accept="image/*" onChange={handleChange} disabled={enviando} className="hidden" />
      {error && <span className="ml-1 text-red-500">{error}</span>}
    </label>
  );
}
