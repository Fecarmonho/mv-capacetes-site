import { getConfiguracoes } from "@/lib/config-db";
import ConfiguracoesForm from "@/components/admin/ConfiguracoesForm";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const config = await getConfiguracoes();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Configurações da loja</h1>
      <ConfiguracoesForm initialConfig={config} />
    </div>
  );
}
