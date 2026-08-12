import { getAllMarcas } from "@/lib/marcas-db";
import MarcaForm from "@/components/admin/MarcaForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminMarcasPage() {
  const marcas = await getAllMarcas();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Marcas</h1>
      <p className="mb-6 text-sm text-ink/50">Usadas no cadastro de produtos e nos filtros do catálogo.</p>

      <MarcaForm />

      {marcas.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhuma marca ainda.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {marcas.map((m) => (
            <span key={m.slug} className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink/70 shadow-card">
              {m.nome}
              <DeleteButton url={`/api/admin/marcas/${m.slug}`} confirmMessage={`Remover a marca "${m.nome}"?`} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
