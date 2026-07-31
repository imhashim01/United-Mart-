import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import clsx from "clsx";
import { formatDate } from "../../../utils/formatCurrency";
import { fadeUp, viewportOnce } from "../../../animations/variants";
import { useAuthStore } from "../../auth/hooks/useAuth";
import * as reviewsApi from "../api/reviewsApi";

function StarRow({ value, size = 14, onHover, onClick, interactive = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && onHover?.(i + 1)}
          onClick={() => interactive && onClick?.(i + 1)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={i < value ? "fill-mango-500 text-mango-500" : "text-border-strong"}
          />
        </button>
      ))}
    </div>
  );
}

const normalizeReview = (review) => ({
  id: review.id ?? review._id,
  userId: review.user?._id ?? review.user?.id ?? review.user,
  name: review.user?.name ?? "Anonymous",
  avatar:
    review.user?.avatar?.url ||
    review.user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || "U")}&background=F7F0EB&color=23442C`,
  rating: review.rating,
  date: review.createdAt,
  comment: review.comment || "",
  verified: !!review.isVerifiedPurchase,
});

export default function ProductReviews({ product }) {
  const currentUser = useAuthStore((s) => s.user);
  const [sortBy, setSortBy] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [formRating, setFormRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await reviewsApi.getProductReviews(product.id, { limit: 100 });
        if (!cancelled) setReviews((data.data || []).map(normalizeReview));
      } catch (error) {
        console.error("Failed to fetch reviews:", error?.response?.data || error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const currentUserId = currentUser?.id ?? currentUser?._id;
  const alreadyReviewed = !!currentUserId && reviews.some((r) => r.userId === currentUserId);

  const breakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1-star ... index 4 = 5-star
    reviews.forEach((r) => counts[r.rating - 1]++);
    const total = reviews.length || 1;
    return counts.map((c, i) => ({ stars: i + 1, count: c, pct: Math.round((c / total) * 100) })).reverse();
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (sortBy === "recent") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "highest") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "lowest") list.sort((a, b) => a.rating - b.rating);
    return list;
  }, [reviews, sortBy]);

  const onSubmit = async (data) => {
    if (formRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const { data: response } = await reviewsApi.createReview({
        product: product.id,
        rating: formRating,
        comment: data.comment,
      });
      setReviews((prev) => [normalizeReview({ ...response.data, user: currentUser }), ...prev]);
      toast.success("Review submitted — thank you!");
      reset();
      setFormRating(0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="border-t border-border pt-8 mt-8"
    >
      <h2 className="font-display text-2xl text-orchard-900 mb-6">
        Customer Reviews ({reviews.length})
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="flex flex-col items-start">
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-4xl font-bold text-charcoal-900 tabular-nums">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-charcoal-600 text-sm">/ 5</span>
          </div>
          <StarRow value={Math.round(product.rating)} size={16} />
          <p className="text-sm text-charcoal-600 mt-1.5">
            Based on {reviews.length} reviews
          </p>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          {breakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-3 text-sm">
              <span className="w-10 text-charcoal-600 shrink-0">{row.stars} star</span>
              <div className="flex-1 h-2 rounded-full bg-linen-50 overflow-hidden">
                <div
                  className="h-full bg-mango-500 rounded-full transition-all"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-charcoal-600 tabular-nums shrink-0">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-charcoal-900">All Reviews</p>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none h-9 pl-3 pr-8 rounded-[var(--radius-sm)] border border-border-strong text-sm bg-white focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-600" />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-charcoal-600 py-6">Loading reviews...</p>
      ) : sortedReviews.length === 0 ? (
        <p className="text-sm text-charcoal-600 py-6">No reviews yet — be the first to share your experience.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {sortedReviews.slice(0, visibleCount).map((review) => (
            <div key={review.id} className="py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-charcoal-900">{review.name}</p>
                      {review.verified && (
                        <span className="flex items-center gap-0.5 text-[11px] text-success-600 font-medium">
                          <BadgeCheck size={13} /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-600">{formatDate(review.date)}</p>
                  </div>
                </div>
                <StarRow value={review.rating} size={13} />
              </div>
              <p className="text-sm text-charcoal-900 mt-3 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {visibleCount < sortedReviews.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => c + 4)}
          className="mt-4 text-sm font-semibold text-orchard-900 hover:text-mango-500 transition-colors"
        >
          Load more reviews
        </button>
      )}

      <div className="mt-10 pt-8 border-t border-border">
        <h3 className="text-base font-semibold text-charcoal-900 mb-4">Write a Review</h3>

        {!currentUser ? (
          <p className="text-sm text-charcoal-600">Please log in to write a review.</p>
        ) : alreadyReviewed ? (
          <p className="text-sm text-charcoal-600">You've already reviewed this product — thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-lg">
            <div>
              <label className="text-sm font-semibold text-charcoal-900 mb-1.5 block">Your Rating</label>
              <div onMouseLeave={() => setHoverRating(0)}>
                <StarRow
                  value={hoverRating || formRating}
                  size={22}
                  interactive
                  onHover={setHoverRating}
                  onClick={setFormRating}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-charcoal-900 mb-1.5 block">Review</label>
              <textarea
                {...register("comment", {
                  required: "Please write a few words",
                  minLength: { value: 10, message: "At least 10 characters" },
                })}
                rows={4}
                placeholder="Share your experience with this product..."
                className={clsx(
                  "w-full px-3.5 py-3 rounded-[var(--radius-sm)] border text-sm resize-none focus:outline-none focus:ring-[3px] transition-all",
                  errors.comment
                    ? "border-danger-600 bg-danger-100/40 focus:ring-danger-600/10"
                    : "border-border-strong focus:border-orchard-700 focus:ring-orchard-900/10"
                )}
              />
              {errors.comment && <p className="text-xs text-danger-600 mt-1">{errors.comment.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="self-start h-11 px-6 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </motion.section>
  );
}