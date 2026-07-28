import AdminLayout from '../../layouts/AdminLayout';
import ReportsView from '../../features/admin/reports/components/ReportsView';

export default function ReportsPage() {
  return (
    <AdminLayout title="Reports">
      <ReportsView />
    </AdminLayout>
  );
}
