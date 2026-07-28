import AdminLayout from '../../layouts/AdminLayout';
import AdminRewardManagement from '../../features/rewards/components/AdminRewardManagement';

export default function RewardProgramPage() {
  return (
    <AdminLayout title="Reward Program Management">
      <AdminRewardManagement />
    </AdminLayout>
  );
}
