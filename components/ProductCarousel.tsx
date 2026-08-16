import { Produto, VarianteProduto } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function ProductCarousel({
  itens,
}: {
  itens: { produto: Produto; variantes?: VarianteProduto[] }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {itens.map(({ produto, variantes }) => (
        <ProductCard key={produto.slug} produto={produto} variantes={variantes} />
      ))}
    </div>
  );
}
