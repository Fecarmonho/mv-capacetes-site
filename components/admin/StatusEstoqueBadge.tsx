export default function StatusEstoqueBadge({ estoque, minimo }: { estoque: number; minimo: number }) {
  if (estoque === 0) {
    return <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-600">🔴 Sem estoque</span>;
  }
  if (estoque <= minimo) {
    return <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600">🟡 Estoque baixo</span>;
  }
  return <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">🟢 Normal</span>;
}
