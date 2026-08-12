import { getAllBanners } from "@/lib/banners-db";
import BannerForm from "@/components/admin/BannerForm";
import BannerCard from "@/components/admin/BannerCard";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await getAllBanners();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Banners</h1>
      <p className="mb-6 text-sm text-ink/50">
        Aparecem no carrossel do topo da home, na ordem abaixo. Só banners marcados como
        &quot;Ativo&quot; aparecem no site.
      </p>

      <BannerForm />

      {banners.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhum banner ainda.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {banners.map((b, i) => (
            <BannerCard key={b.id} banner={b} vizinhoAnterior={banners[i - 1]} vizinhoSeguinte={banners[i + 1]} />
          ))}
        </div>
      )}
    </div>
  );
}
