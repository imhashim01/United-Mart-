import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useCartStore } from "../../../store/cartStore";
import { formatPrice } from "../../../utils/formatCurrency";
import * as rewardsApi from "../../rewards/api/rewardsApi";

export default function RewardPointsRedeem() {
  const rewardPointsAvailable = useCartStore((s) => s.rewardPointsAvailable);
  const setRewardPointsAvailable = useCartStore((s) => s.setRewardPointsAvailable);
  const rewardPointsToRedeem = useCartStore((s) => s.rewardPointsToRedeem);
  const setRewardPointsToRedeem = useCartStore((s) => s.setRewardPointsToRedeem);
  const subtotal = useCartStore((s) => s.subtotal());
  const pointsToEarn = useCartStore((s) => s.pointsToEarn());

  useEffect(() => {
    (async () => {
      try {
        const { data } = await rewardsApi.getUserRewards();
        setRewardPointsAvailable(data.data?.currentBalance ?? 0);
      } catch (error) {
        console.error("Failed to fetch reward balance:", error?.response?.data || error.message);
      }
    })();
  }, [setRewardPointsAvailable]);

  const maxRedeemable = Math.min(rewardPointsAvailable, Math.floor(subtotal * 0.5));

  if (rewardPointsAvailable === 0) return null;



  return (
    <div className="border border-border rounded-[var(--radius-md)] p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-charcoal-900 flex items-center gap-1.5">
          <Sparkles size={15} className="text-mango-500" />
          United Rewards
        </p>
        <span className="text-xs text-charcoal-600 tabular-nums">
          {rewardPointsAvailable} pts available
        </span>
      </div>

      {maxRedeemable > 0 ? (
        <>
          <input
            type="range"
            min={0}
            max={maxRedeemable}
            value={rewardPointsToRedeem}
            onChange={(e) => setRewardPointsToRedeem(Number(e.target.value))}
            className="w-full accent-mango-500 mt-3"
          />
          <div className="flex items-center justify-between text-xs text-charcoal-600 mt-1">
            <span>0 pts</span>
            <span className="font-semibold text-charcoal-900">
              Redeeming {rewardPointsToRedeem} pts (−{formatPrice(rewardPointsToRedeem)})
            </span>
            <span>{maxRedeemable} pts</span>
          </div>
        </>
      ) : (
        <p className="text-xs text-charcoal-600 mt-2">Add items to your cart to redeem points.</p>
      )}

      {pointsToEarn > 0 && (
        <p className="text-xs text-success-600 mt-3 pt-3 border-t border-border">
          You&apos;ll earn <span className="font-semibold">{pointsToEarn} points</span> from this order
        </p>
      )}
    </div>
  );
}
