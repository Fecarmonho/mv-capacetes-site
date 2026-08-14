"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Produto, VarianteProduto, FotoProduto, Marca, MOTIVOS_ENTRADA } from "@/lib/types";
import { slugify } from "@/lib/slug";
import { processarFoto } from "@/lib/image-compress";
import { uid } from "@/lib/uid";

const MAX_FOTOS_EXTRAS = 5;
const ESTADOS_CONSERVACAO = ["Excelente", "Muito bom", "Bom", "Regular"];

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type LinhaVariante = { id?: string; tamanho: string; estoque: number };
type LinhaFoto = FotoProduto & { nova?: boolean };

export default function ProductForm({
  initialProduto,
  initialVariantes = [],
  initialFotosExtras = [],
  marcas,
}: {
  initialProduto?: Produto;
  initialVariantes?: VarianteProduto[];
  initialFotosExtras?: FotoProduto[];
  marcas: Marca[];
}) {
  const router = useRouter();
  const isEditing = Boolean(initialProduto);

  const [form, setForm] = useState<Produto>(
    initialProduto ?? {
      slug: "",
      nome: "",
      tipo: "novo",
      marca: marcas[0]?.nome ?? "",
      modelo: "",
      cor: "",
      tamanho: "",
      precoCompra: undefined,
      preco: 0,
      precoPromocional: undefined,
      quantidadeEstoque: 0,
      quantidadeMinima: 3,
      status: "ativo",
      descricao: "",
      caracteristicas: [],
      imagemUrl: "",
      totalFotos: 1,
      dataCadastro: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    }
  );

  const [temVariantes, setTemVariantes] = useState(initialVariantes.length > 0);
  const [variantes, setVariantes] = useState<LinhaVariante[]>(
    initialVariantes.map((v) => ({ id: v.id, tamanho: v.tamanho, estoque: v.estoque }))
  );
  const [novaCaracteristica, setNovaCaracteristica] = useState("");
  // A versão em alta da capa mora junto das fotos extras (fid "capa"); se
  // por algum motivo não estiver lá, cai pra mini mesmo (produto antigo).
  const capaSalva = initialFotosExtras.find((f) => f.fid === "capa");
  const [capa, setCapa] = useState<LinhaFoto | null>(
    initialProduto?.imagemUrl
      ? { fid: "capa", mini: initialProduto.imagemUrl, grande: capaSalva?.grande ?? initialProduto.imagemUrl }
      : null
  );
  const [fotosExtras, setFotosExtras] = useState<LinhaFoto[]>(initialFotosExtras.filter((f) => f.fid !== "capa"));
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof Produto>(key: K, value: Produto[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNomeChange(value: string) {
    update("nome", value);
    if (!isEditing) update("slug", slugify(value));
  }

  function addVariante() {
    setVariantes((prev) => [...prev, { tamanho: "", estoque: 0 }]);
  }
  function updateVarianteLinha(index: number, dados: Partial<LinhaVariante>) {
    setVariantes((prev) => prev.map((v, i) => (i === index ? { ...v, ...dados } : v)));
  }
  function removeVarianteLinha(index: number) {
    setVariantes((prev) => prev.filter((_, i) => i !== index));
  }

  function addCaracteristica() {
    const valor = novaCaracteristica.trim();
    if (!valor) return;
    update("caracteristicas", [...form.caracteristicas, valor]);
    setNovaCaracteristica("");
  }
  function removeCaracteristica(index: number) {
    update("caracteristicas", form.caracteristicas.filter((_, i) => i !== index));
  }

  async function handleCapaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setEnviandoFoto(true);
    try {
      const { mini, grande } = await processarFoto(file);
      setCapa({ fid: "capa", mini, grande });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar a foto.");
    } finally {
      setEnviandoFoto(false);
    }
  }

  async function handleFotosExtrasChange(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = [...(e.target.files ?? [])];
    e.target.value = "";
    if (!arquivos.length) return;
    const vagas = MAX_FOTOS_EXTRAS - fotosExtras.length;
    if (vagas <= 0) {
      setError(`Máximo de ${MAX_FOTOS_EXTRAS} fotos extras por produto.`);
      return;
    }
    setEnviandoFoto(true);
    try {
      for (const file of arquivos.slice(0, vagas)) {
        const { mini, grande } = await processarFoto(file);
        setFotosExtras((prev) => [...prev, { fid: uid(), mini, grande, nova: true }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar uma das fotos.");
    } finally {
      setEnviandoFoto(false);
    }
  }
  function removeFotoExtra(fid: string) {
    setFotosExtras((prev) => prev.filter((f) => f.fid !== fid));
  }
  function tornarCapa(fid: string) {
    const alvo = fotosExtras.find((f) => f.fid === fid);
    if (!alvo) return;
    setFotosExtras((prev) => [...prev.filter((f) => f.fid !== fid), ...(capa ? [capa] : [])]);
    setCapa(alvo);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.nome || !form.preco || form.preco <= 0) {
      setError("Preencha nome e um preço de venda válido.");
      return;
    }
    if (!capa) {
      setError("Envie a foto de capa do produto.");
      return;
    }
    if (temVariantes && variantes.some((v) => !v.tamanho.trim())) {
      setError("Preencha o tamanho de todas as variantes ou remova as vazias.");
      return;
    }
    if (form.tipo === "usado" && !form.tamanho?.trim() && !temVariantes) {
      setError("Informe o tamanho do capacete usado.");
      return;
    }
    if (enviandoFoto) {
      setError("Espere as fotos terminarem de carregar.");
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/admin/produtos/${initialProduto!.slug}` : "/api/admin/produtos";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        produto: { ...form, imagemUrl: capa.mini, tamanho: temVariantes ? undefined : form.tamanho },
        variantes: temVariantes ? variantes : [],
        // A versão em alta da capa viaja junto (fid "capa") pra ampliação
        // na página do produto não usar a mesma foto pequena do card.
        fotos: [{ fid: "capa", mini: capa.mini, grande: capa.grande }, ...fotosExtras].map(
          ({ fid, mini, grande }) => ({ fid, mini, grande })
        ),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Não foi possível salvar o produto.");
      }

      router.push("/admin/estoque");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none";
  const labelClass = "block text-sm font-medium text-ink/80";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Bloco: Informações básicas */}
      <section className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Informações básicas</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Nome do produto
            <input required value={form.nome} onChange={(e) => handleNomeChange(e.target.value)} className={inputClass} placeholder="Ex: LS2 FF353 Rapid" />
          </label>
          <label className={labelClass}>
            Tipo
            <select value={form.tipo} onChange={(e) => update("tipo", e.target.value as Produto["tipo"])} className={inputClass}>
              <option value="novo">Novo</option>
              <option value="usado">Usado</option>
            </select>
          </label>
          <label className={labelClass}>
            Marca
            <select value={form.marca} onChange={(e) => update("marca", e.target.value)} className={inputClass}>
              {marcas.map((m) => (
                <option key={m.slug} value={m.nome}>{m.nome}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Modelo
            <input required value={form.modelo} onChange={(e) => update("modelo", e.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Status
            <select value={form.status} onChange={(e) => update("status", e.target.value as Produto["status"])} className={inputClass}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="esgotado">Esgotado</option>
              <option value="vendido">Vendido</option>
            </select>
          </label>
        </div>
      </section>

      {/* Bloco: Comercial */}
      <section className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Comercial</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <label className={labelClass}>
            Preço de compra (R$)
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.precoCompra ?? ""}
              onChange={(e) => update("precoCompra", e.target.value ? parseFloat(e.target.value) : undefined)}
              className={inputClass}
            />
            <span className="mt-1 block text-[11px] font-normal text-ink/40">Só pra calcular a margem — não aparece pro cliente.</span>
          </label>
          <label className={labelClass}>
            Preço de venda (R$)
            <input required type="number" min={0} step={0.01} value={form.preco || ""} onChange={(e) => update("preco", parseFloat(e.target.value) || 0)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Preço promocional (R$)
            <input type="number" min={0} step={0.01} value={form.precoPromocional ?? ""} onChange={(e) => update("precoPromocional", e.target.value ? parseFloat(e.target.value) : undefined)} className={inputClass} />
          </label>
        </div>

        {Boolean(form.precoCompra) && form.preco > 0 && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-paper px-3 py-2 text-sm">
            <span className="text-ink/60">Margem sobre o preço de venda:</span>
            {(() => {
              const margem = ((form.preco - (form.precoCompra ?? 0)) / (form.precoCompra ?? 1)) * 100;
              const cor = margem > 30 ? "text-emerald-600" : margem > 10 ? "text-amber-600" : "text-red-500";
              return <span className={`font-bold ${cor}`}>{margem.toFixed(0)}%</span>;
            })()}
            <span className="text-ink/40">· lucro de {formatBRL(form.preco - (form.precoCompra ?? 0))}</span>
          </div>
        )}
      </section>

      {/* Bloco: Estoque / Variantes */}
      <section className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Estoque</h2>
          <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
            <input type="checkbox" checked={temVariantes} onChange={(e) => setTemVariantes(e.target.checked)} />
            Tem variantes de tamanho
          </label>
        </div>

        {temVariantes ? (
          <div className="mt-4 space-y-3">
            {variantes.map((v, i) => (
              <div key={v.id ?? i} className="flex items-center gap-3">
                <input
                  placeholder="Tamanho (ex: 58)"
                  value={v.tamanho}
                  onChange={(e) => updateVarianteLinha(i, { tamanho: e.target.value })}
                  className={`${inputClass} mt-0 flex-1`}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Estoque"
                  value={v.estoque}
                  disabled={Boolean(v.id)}
                  title={v.id ? "Ajuste o saldo em Estoque > Movimentar" : undefined}
                  onChange={(e) => updateVarianteLinha(i, { estoque: parseInt(e.target.value) || 0 })}
                  className={`${inputClass} mt-0 w-28 disabled:bg-paper disabled:text-ink/40`}
                />
                <button type="button" onClick={() => removeVarianteLinha(i)} className="text-sm font-semibold text-red-500">
                  Remover
                </button>
              </div>
            ))}
            <button type="button" onClick={addVariante} className="text-sm font-semibold text-blue">
              + Adicionar tamanho
            </button>
            {variantes.some((v) => v.id) && (
              <p className="text-xs text-ink/40">
                O saldo de tamanhos já cadastrados só muda em Estoque → Movimentar (fica registrado no histórico).
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <label className={labelClass}>
              Tamanho
              <input value={form.tamanho ?? ""} onChange={(e) => update("tamanho", e.target.value)} className={inputClass} placeholder="Ex: 58" />
            </label>
            <label className={labelClass}>
              Estoque {isEditing && <span className="font-normal text-ink/40">(ajuste em Estoque → Movimentar)</span>}
              <input
                type="number"
                min={0}
                value={form.quantidadeEstoque}
                disabled={isEditing}
                onChange={(e) => update("quantidadeEstoque", parseInt(e.target.value) || 0)}
                className={`${inputClass} disabled:bg-paper disabled:text-ink/40`}
              />
            </label>
            <label className={labelClass}>
              Estoque mínimo
              <input type="number" min={0} value={form.quantidadeMinima} onChange={(e) => update("quantidadeMinima", parseInt(e.target.value) || 0)} className={inputClass} />
            </label>
          </div>
        )}
        {temVariantes && (
          <label className={`${labelClass} mt-4 max-w-[200px]`}>
            Estoque mínimo (por tamanho)
            <input type="number" min={0} value={form.quantidadeMinima} onChange={(e) => update("quantidadeMinima", parseInt(e.target.value) || 0)} className={inputClass} />
          </label>
        )}
      </section>

      {/* Bloco: Características */}
      <section className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Características</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Cor
            <input value={form.cor} onChange={(e) => update("cor", e.target.value)} className={inputClass} />
          </label>
        </div>
        <label className={`${labelClass} mt-4`}>
          Descrição
          <textarea required rows={4} value={form.descricao} onChange={(e) => update("descricao", e.target.value)} className={inputClass} />
        </label>
        <div className="mt-4">
          <span className={labelClass}>Outras características</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.caracteristicas.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink/70">
                {c}
                <button type="button" onClick={() => removeCaracteristica(i)} className="text-ink/40 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={novaCaracteristica}
              onChange={(e) => setNovaCaracteristica(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCaracteristica())}
              placeholder="Ex: Viseira anti-risco"
              className={`${inputClass} mt-0 flex-1`}
            />
            <button type="button" onClick={addCaracteristica} className="rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink/70">
              Adicionar
            </button>
          </div>
        </div>
      </section>

      {/* Bloco: Produto usado (condicional) */}
      {form.tipo === "usado" && (
        <section className="rounded-2xl border border-blue/20 bg-blue/[0.03] p-6 shadow-card sm:p-8">
          <h2 className="font-display text-lg font-bold text-ink">Produto usado</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Estado de conservação
              <select value={form.estadoConservacao ?? ""} onChange={(e) => update("estadoConservacao", e.target.value)} className={inputClass}>
                <option value="">Selecione</option>
                {ESTADOS_CONSERVACAO.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Tempo de uso
              <input value={form.tempoUso ?? ""} onChange={(e) => update("tempoUso", e.target.value)} className={inputClass} placeholder="Ex: 8 meses" />
            </label>
          </div>
          <label className={`${labelClass} mt-4`}>
            Acessórios inclusos
            <input value={form.acessoriosInclusos ?? ""} onChange={(e) => update("acessoriosInclusos", e.target.value)} className={inputClass} placeholder="Ex: viseira solar extra" />
          </label>
          <label className={`${labelClass} mt-4`}>
            Observações (marcas de uso, reparos, etc.)
            <textarea rows={3} value={form.observacoesUsado ?? ""} onChange={(e) => update("observacoesUsado", e.target.value)} className={inputClass} />
          </label>
        </section>
      )}

      {/* Bloco: Imagens */}
      <section className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Imagens</h2>

        <div className="mt-4">
          <span className={labelClass}>Foto de capa</span>
          <div className="mt-1 flex items-center gap-4">
            {capa ? (
              <img src={capa.mini} alt="Capa" className="h-24 w-24 rounded-lg border border-ink/10 object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-ink/15 text-[10px] text-ink/30">
                Sem foto
              </div>
            )}
            <label className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 hover:border-ink/30">
              {enviandoFoto ? "Processando..." : capa ? "Trocar foto" : "Escolher foto"}
              <input type="file" accept="image/*" onChange={handleCapaChange} disabled={enviandoFoto} className="hidden" />
            </label>
          </div>
        </div>

        <div className="mt-6">
          <span className={labelClass}>Fotos extras (até {MAX_FOTOS_EXTRAS})</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {fotosExtras.map((f) => (
              <div key={f.fid} className="relative">
                <img src={f.mini} alt="" className="h-20 w-20 rounded-lg border border-ink/10 object-cover" />
                <div className="mt-1 flex justify-center gap-2 text-[10px]">
                  <button type="button" onClick={() => tornarCapa(f.fid)} className="font-semibold text-blue">Tornar capa</button>
                  <button type="button" onClick={() => removeFotoExtra(f.fid)} className="font-semibold text-red-500">Remover</button>
                </div>
              </div>
            ))}
            {fotosExtras.length < MAX_FOTOS_EXTRAS && (
              <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-ink/15 text-[11px] font-semibold text-ink/50 hover:border-ink/30">
                {enviandoFoto ? "..." : "+ Foto"}
                <input type="file" accept="image/*" multiple onChange={handleFotosExtrasChange} disabled={enviandoFoto} className="hidden" />
              </label>
            )}
          </div>
        </div>
      </section>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving || enviandoFoto} className="btn-blue rounded-full px-6 py-3 font-display font-bold text-white disabled:opacity-60">
          {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Adicionar produto"}
        </button>
        <button type="button" onClick={() => router.push("/admin/estoque")} className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink/70 hover:border-ink/30">
          Cancelar
        </button>
      </div>
    </form>
  );
}
