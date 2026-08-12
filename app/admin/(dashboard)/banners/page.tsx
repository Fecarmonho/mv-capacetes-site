import { getAllBanners } from "@/lib/banners-db";
import BannerForm from "@/components/admin/BannerForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await getAllBanners();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Banners</h1>
      <p className="mb-6 text-sm text-ink/50">Aparecem no carrossel do topo da home.</p>

      <BannerForm />

      {banners.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhum banner ainda.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {banners.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-4 rounded-2xl border border-ink/8 bg-white p-4 shadow-card">
              <div className="flex items-center gap-4">
                <img src={b.imagem} alt={b.titulo ?? ""} className="h-14 w-24 rounded-lg object-cover" />
                <div>
                  <p className="font-medium text-ink">{b.titulo || "Sem título"}</p>
                  {b.link && <p className="text-xs text-ink/40">{b.link}</p>}
                </div>
              </div>
              <DeleteButton url={`/api/admin/banners/${b.id}`} confirmMessage="Remover este banner?" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
