import ProductForm from "@/components/admin/ProductForm";
import { getAllMarcas } from "@/lib/marcas-db";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const marcas = await getAllMarcas();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Adicionar produto</h1>
      {marcas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Cadastre pelo menos uma marca antes de criar um produto.
        </p>
      ) : (
        <ProductForm marcas={marcas} />
      )}
    </div>
  );
}
