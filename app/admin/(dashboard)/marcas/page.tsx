import { getAllMarcas } from "@/lib/marcas-db";
import MarcaForm from "@/components/admin/MarcaForm";
import MarcaLogoUpload from "@/components/admin/MarcaLogoUpload";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminMarcasPage() {
  const marcas = await getAllMarcas();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Marcas</h1>
      <p className="mb-6 text-sm text-ink/50">
        Usadas no cadastro de produtos, nos filtros do catálogo e nos cards de marcas da home
        (só aparecem lá as marcas com produto em estoque).
      </p>

      <MarcaForm />

      {marcas.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhuma marca ainda.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {marcas.map((m) => (
            <div key={m.slug} className="flex flex-col items-center gap-2 rounded-2xl border border-ink/8 bg-white p-4 text-center shadow-card">
              {m.logo ? (
                <img src={m.logo} alt={m.nome} className="h-14 w-14 object-contain" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-ink/15 text-[9px] text-ink/30">
                  Sem logo
                </div>
              )}
              <p className="text-sm font-semibold text-ink">{m.nome}</p>
              <div className="flex items-center gap-3">
                <MarcaLogoUpload slug={m.slug} />
                <DeleteButton url={`/api/admin/marcas/${m.slug}`} confirmMessage={`Remover a marca "${m.nome}"?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
