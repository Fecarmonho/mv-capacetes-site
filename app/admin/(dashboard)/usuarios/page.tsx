import { getAdminSession } from "@/lib/admin-session";
import { getAllAdmins } from "@/lib/admins-db";
import UsuarioForm from "@/components/admin/UsuarioForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const [session, admins] = await Promise.all([getAdminSession(), getAllAdmins()]);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Usuários</h1>
      <p className="mb-6 text-sm text-ink/50">Quem tem acesso ao painel administrativo.</p>

      <UsuarioForm />

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink/40">
            <tr>
              <th className="px-4 py-3 sm:px-6">Nome</th>
              <th className="px-4 py-3 sm:px-6">Email</th>
              <th className="px-4 py-3 text-right sm:px-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {admins.map((admin) => {
              const vocêMesmo = admin.uid === session?.uid;
              return (
                <tr key={admin.uid}>
                  <td className="px-4 py-3 font-semibold text-ink sm:px-6">
                    {admin.name}
                    {vocêMesmo && <span className="ml-2 text-xs font-normal text-ink/40">(você)</span>}
                  </td>
                  <td className="px-4 py-3 text-ink/60 sm:px-6">{admin.email}</td>
                  <td className="px-4 py-3 text-right sm:px-6">
                    {!vocêMesmo && admins.length > 1 && (
                      <DeleteButton url={`/api/admin/usuarios/${admin.uid}`} confirmMessage={`Remover o acesso de "${admin.name}"?`} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
