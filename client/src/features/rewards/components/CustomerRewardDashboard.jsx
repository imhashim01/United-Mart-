import { useEffect, useState } from 'react';
import { Gift, Star, History } from 'lucide-react';
import { useRewards } from '../hooks/useRewards';
import { useAuthStore } from '../../auth/hooks/useAuth';

export default function CustomerRewardDashboard() {
  const { user } = useAuthStore();
  const { dashboard, loading, error, fetchDashboard, redeem } = useRewards(user?.id);
  const [selectedGift, setSelectedGift] = useState(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchDashboard();
    }
  }, [user?.id, fetchDashboard]);

  const handleRedeem = async (giftLevelId) => {
    setRedeeming(true);
    try {
      await redeem(giftLevelId);
      setSelectedGift(null);
      alert('Gift redeemed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to redeem gift');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading rewards...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (!dashboard) {
    return <div className="text-center py-12">No reward data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Your Reward Points</p>
            <p className="text-5xl font-bold">{dashboard.totalPoints}</p>
          </div>
          <Star size={64} className="opacity-20" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Total Earned</p>
          <p className="text-2xl font-semibold text-gray-900">{dashboard.pointsEarned}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Total Redeemed</p>
          <p className="text-2xl font-semibold text-gray-900">{dashboard.pointsRedeemed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-semibold text-gray-900">1:Rs.100</p>
        </div>
      </div>

      {/* Next Level */}
      {dashboard.nextLevel && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">
            🎁 Next Level: <strong>{dashboard.nextLevel.name}</strong>
          </p>
          <div className="bg-white rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all"
              style={{
                width: `${Math.min((dashboard.totalPoints / dashboard.nextLevel.pointsRequired) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-blue-700 mt-2">
            {dashboard.nextLevel.pointsRequired - dashboard.totalPoints} points to reach{' '}
            <strong>{dashboard.nextLevel.name}</strong> and get Rs.{dashboard.nextLevel.discount} off!
          </p>
        </div>
      )}

      {/* Gift Levels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Gift size={20} />
          Redeem Your Gifts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboard.giftLevels?.map((level) => (
            <div
              key={level.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${
                dashboard.totalPoints >= level.pointsRequired
                  ? 'border-green-300 bg-green-50 hover:border-green-500'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
              onClick={() =>
                dashboard.totalPoints >= level.pointsRequired && setSelectedGift(level)
              }
            >
              <p className="font-semibold text-gray-900">{level.name}</p>
              <p className="text-2xl font-bold text-blue-600 my-2">{level.pointsRequired}</p>
              <p className="text-xs text-gray-600 mb-3">Points needed</p>
              <p className="text-sm font-medium text-gray-900 mb-3">Get Rs.{level.discount}</p>
              <button
                disabled={dashboard.totalPoints < level.pointsRequired}
                className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
                  dashboard.totalPoints >= level.pointsRequired
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {dashboard.totalPoints >= level.pointsRequired ? 'Redeem' : 'Locked'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Redemptions */}
      {dashboard.recentRedemptions?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <History size={20} />
            Recent Redemptions
          </h3>
          <div className="space-y-2">
            {dashboard.recentRedemptions.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{r.giftName}</p>
                  <p className="text-xs text-gray-600">{new Date(r.redeemedAt).toLocaleDateString()}</p>
                </div>
                <p className="font-semibold text-green-600">+Rs.{r.discountValue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redemption Modal */}
      {selectedGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Redeem {selectedGift.name} Gift</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Points to use:</span>
                <span className="font-semibold">{selectedGift.pointsRequired}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount value:</span>
                <span className="font-semibold text-green-600">Rs.{selectedGift.discount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Points remaining:</span>
                <span className="font-semibold">
                  {dashboard.totalPoints - selectedGift.pointsRequired}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedGift(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRedeem(selectedGift.id)}
                disabled={redeeming}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {redeeming ? 'Redeeming...' : 'Confirm Redemption'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
