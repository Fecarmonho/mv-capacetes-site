"use client";

import { useState } from "react";
import { ConfiguracoesLoja } from "@/lib/types";

export default function ConfiguracoesForm({ initialConfig }: { initialConfig: ConfiguracoesLoja }) {
  const [form, setForm] = useState<ConfiguracoesLoja>(initialConfig);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ConfiguracoesLoja>(key: K, value: ConfiguracoesLoja[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSucesso(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.nomeLoja.trim()) {
      setError("O nome da loja é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Não foi possível salvar as configurações.");
      setSucesso(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none";
  const labelClass = "block text-sm font-medium text-ink/80";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Identidade</h2>
        <label className={`${labelClass} mt-4`}>
          Nome da loja
          <input required value={form.nomeLoja} onChange={(e) => update("nomeLoja", e.target.value)} className={inputClass} />
        </label>
        <label className={`${labelClass} mt-4`}>
          Texto institucional (aparece no rodapé)
          <textarea rows={2} value={form.textoInstitucional} onChange={(e) => update("textoInstitucional", e.target.value)} className={inputClass} />
        </label>
      </section>

      <section className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Contato</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            WhatsApp (só números, com DDI e DDD)
            <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="5511999999999" className={`${inputClass} font-mono`} />
          </label>
          <label className={labelClass}>
            Instagram (link completo)
            <input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/mvcapacetes" className={inputClass} />
          </label>
          <label className={labelClass}>
            E-mail
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Horário de atendimento
            <input value={form.horarioAtendimento} onChange={(e) => update("horarioAtendimento", e.target.value)} placeholder="Seg a Sáb, 9h às 18h" className={inputClass} />
          </label>
        </div>
        <label className={`${labelClass} mt-4`}>
          Endereço
          <input value={form.endereco} onChange={(e) => update("endereco", e.target.value)} className={inputClass} />
        </label>
      </section>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      {sucesso && <p className="text-sm font-medium text-emerald-600">Configurações salvas.</p>}

      <button type="submit" disabled={saving} className="btn-blue rounded-full px-6 py-3 font-display font-bold text-white disabled:opacity-60">
        {saving ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}
