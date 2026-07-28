import { useEffect, useState } from 'react';
import { Edit2, Plus } from 'lucide-react';
import { useRewards } from '../hooks/useRewards';

export default function AdminRewardManagement() {
  const {
    giftLevels,
    rewardRules,
    allRedemptions,
    fetchGiftLevels,
    fetchRules,
    fetchAllRedemptions,
    updateRules,
    updateGift,
    addGift,
  } = useRewards(null);

  const [editingRule, setEditingRule] = useState(null);
  const [editingGift, setEditingGift] = useState(null);
  const [showAddGift, setShowAddGift] = useState(false);

  useEffect(() => {
    fetchRules();
    fetchGiftLevels();
    fetchAllRedemptions();
  }, [fetchRules, fetchGiftLevels, fetchAllRedemptions]);

  const handleSaveRule = async () => {
    try {
      await updateRules(editingRule);
      setEditingRule(null);
      alert('Rules updated successfully');
    } catch (err) {
      alert('Failed to update rules');
    }
  };

  const handleSaveGift = async () => {
    try {
      if (editingGift?.id) {
        await updateGift(editingGift.id, editingGift);
      } else {
        await addGift(editingGift);
      }
      setEditingGift(null);
      setShowAddGift(false);
      alert('Gift level updated successfully');
      fetchGiftLevels();
    } catch (err) {
      alert('Failed to save gift level');
    }
  };

  return (
    <div className="space-y-6">
      {/* Reward Rules */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Reward Rules</h2>
          <button
            onClick={() => setEditingRule(rewardRules)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit2 size={16} className="inline mr-2" />
            Edit Rules
          </button>
        </div>

        {rewardRules && (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Points Per Rupee:</span>
              <span className="text-gray-600">{rewardRules.pointsPerRupee}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Base Amount:</span>
              <span className="text-gray-600">Rs.{rewardRules.baseAmount}</span>
            </div>
          </div>
        )}

        {editingRule && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Per Rupee
                </label>
                <input
                  type="number"
                  value={editingRule.pointsPerRupee}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, pointsPerRupee: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Amount (Rs.)
                </label>
                <input
                  type="number"
                  value={editingRule.baseAmount}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, baseAmount: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveRule}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingRule(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gift Levels */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Gift Levels</h2>
          <button
            onClick={() => {
              setShowAddGift(true);
              setEditingGift({ name: '', pointsRequired: 0, discount: 0 });
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={16} className="inline mr-2" />
            Add Level
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                  Points Required
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                  Discount Value
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {giftLevels?.map((level) => (
                <tr key={level.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{level.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{level.pointsRequired}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Rs.{level.discount}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setEditingGift(level)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(editingGift || showAddGift) && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingGift?.name || ''}
                  onChange={(e) =>
                    setEditingGift({ ...editingGift, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Required
                </label>
                <input
                  type="number"
                  value={editingGift?.pointsRequired || 0}
                  onChange={(e) =>
                    setEditingGift({ ...editingGift, pointsRequired: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value (Rs.)
                </label>
                <input
                  type="number"
                  value={editingGift?.discount || 0}
                  onChange={(e) =>
                    setEditingGift({ ...editingGift, discount: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveGift}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingGift(null);
                  setShowAddGift(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Redemptions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Redemptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">User ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Gift</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Points Used</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Discount</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {allRedemptions?.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{r.userId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{r.giftName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{r.pointsUsed}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Rs.{r.discountValue}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(r.redeemedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
