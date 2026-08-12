import Link from "next/link";
import { getAllCategorias } from "@/lib/categorias-db";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const categorias = await getAllCategorias();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Categorias</h1>
          <p className="mt-1 text-sm text-ink/50">Organizam os capacetes no catálogo e nos atalhos da home.</p>
        </div>
        <Link href="/admin/categorias/nova" className="btn-blue rounded-full px-5 py-2.5 text-center text-sm font-bold text-white">
          + Nova categoria
        </Link>
      </div>

      {categorias.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhuma categoria ainda. Crie uma, tipo &quot;Escamoteáveis&quot;.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {categorias.map((c) => (
            <div key={c.slug} className="flex items-center justify-between rounded-2xl border border-ink/8 bg-white p-4 shadow-card sm:p-5">
              <div>
                <p className="font-medium text-ink">{c.nome}</p>
                <p className="text-xs text-ink/40">/{c.slug}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href={`/admin/categorias/${c.slug}`} className="font-semibold text-blue hover:underline">Editar</Link>
                <DeleteButton url={`/api/admin/categorias/${c.slug}`} confirmMessage={`Remover a categoria "${c.nome}"?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
