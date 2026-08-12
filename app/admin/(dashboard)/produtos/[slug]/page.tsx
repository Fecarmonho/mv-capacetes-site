import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProdutoBySlug } from "@/lib/produtos-db";
import { getVariantesByProduto } from "@/lib/variantes-db";
import { getFotosExtras } from "@/lib/fotos-db";
import { getAllCategorias } from "@/lib/categorias-db";
import { getAllMarcas } from "@/lib/marcas-db";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({ params }: { params: { slug: string } }) {
  const [produto, variantes, fotosExtras, categorias, marcas] = await Promise.all([
    getProdutoBySlug(params.slug),
    getVariantesByProduto(params.slug),
    getFotosExtras(params.slug),
    getAllCategorias(),
    getAllMarcas(),
  ]);

  if (!produto) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Editar produto</h1>
      <ProductForm
        initialProduto={produto}
        initialVariantes={variantes}
        initialFotosExtras={fotosExtras}
        categorias={categorias}
        marcas={marcas}
      />
    </div>
  );
}
