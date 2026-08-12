import { notFound } from "next/navigation";
import CategoriaForm from "@/components/admin/CategoriaForm";
import { getCategoriaBySlug } from "@/lib/categorias-db";

export const dynamic = "force-dynamic";

export default async function EditarCategoriaPage({ params }: { params: { slug: string } }) {
  const categoria = await getCategoriaBySlug(params.slug);
  if (!categoria) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Editar categoria</h1>
      <CategoriaForm initialCategoria={categoria} />
    </div>
  );
}
