import { getAllSecoes } from "@/lib/secoes-db";
import { getAllProdutos } from "@/lib/produtos-db";
import SecaoForm from "@/components/admin/SecaoForm";
import SecaoCard from "@/components/admin/SecaoCard";

export const dynamic = "force-dynamic";

export default async function AdminSecoesPage() {
  const [secoes, produtos] = await Promise.all([getAllSecoes(), getAllProdutos()]);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Seções da home</h1>
      <p className="mb-6 text-sm text-ink/50">
        Monte vitrines de produtos escolhidos por você (ex: &quot;Ofertas da semana&quot;) — aparecem na home, logo abaixo de
        &quot;Compre por marca&quot;. Preço e estoque exibidos sempre vêm do cadastro atual do produto.
      </p>

      <SecaoForm produtos={produtos} />

      {secoes.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {secoes.map((s, i) => (
            <SecaoCard key={s.id} secao={s} produtos={produtos} vizinhoAnterior={secoes[i - 1]} vizinhoSeguinte={secoes[i + 1]} />
          ))}
        </div>
      )}
    </div>
  );
}
