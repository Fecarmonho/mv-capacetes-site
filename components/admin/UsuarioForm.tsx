"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UsuarioForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Não foi possível criar o usuário.");
      }
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar o usuário.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none";
  const labelClass = "block text-sm font-medium text-ink/80";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card sm:p-6">
      <h2 className="font-display text-base font-bold text-ink">Novo usuário</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className={labelClass}>
          Nome
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Senha
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </label>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      <button type="submit" disabled={saving} className="btn-blue mt-4 rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
        {saving ? "Criando..." : "Adicionar usuário"}
      </button>
    </form>
  );
}
