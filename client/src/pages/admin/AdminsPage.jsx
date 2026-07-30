import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import RoleBadge from "../../components/auth/RoleBadge";
import { formatDate } from "../../utils/formatCurrency";
import * as usersApi from "../../features/admin/users/api/usersApi";

export default function AdminsPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const removeStaff = async (id) => {
    const person = staff.find((s) => s.id === id);
    if (!person) return;
    if (!window.confirm(`Remove ${person.name} from staff?`)) return;
    try {
      await usersApi.setActiveStatus(id, false);
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success(`${person.name} removed from staff`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove staff');
      console.error('Remove staff failed:', error?.response || error.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await usersApi.listUsers({ limit: 100 });
        setStaff(data.data || []);
      } catch (error) {
        console.error('Failed to load admin users:', error?.response || error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminLayout title="Admins">
      <div className="flex justify-end mb-5">
        <button className="flex items-center gap-1.5 h-10 px-4 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors">
          <Plus size={16} />
          Invite Staff Member
        </button>
      </div>

      <AdminTableShell isEmpty={staff.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Role</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Last Active</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-charcoal-900">{s.name}</p>
                      <p className="text-xs text-charcoal-600">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><RoleBadge role={s.role} /></td>
                <td className="px-4 py-3 text-charcoal-600">{formatDate(s.lastActive)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeStaff(s.id)}
                    aria-label={`Remove ${s.name}`}
                    className="p-1.5 text-charcoal-600 hover:text-danger-600 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminLayout>
  );
}