import mongoose from 'mongoose';
import Review from '../models/reviewModel.js';
import Product from '../../products/models/productModel.js';
import Order from '../../orders/models/orderModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';

const recalculateProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
    { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const { average = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, {
    'ratings.average': Math.round(average * 10) / 10,
    'ratings.count': count,
  });
};

export const listReviews = async (queryString, filter = {}) => {
  const total = await Review.countDocuments({ ...filter, ...new ApiFeatures(Review.find(), queryString).filter().query.getFilter() });
  const features = new ApiFeatures(Review.find(filter).populate('user', 'name avatar'), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;
  return { reviews, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getProductReviews = async (productId, queryString) =>
  listReviews(queryString, { product: productId, isApproved: true });

export const createReview = async (userId, { product, order, rating, title, comment }) => {
  const existing = await Review.findOne({ product, user: userId });
  if (existing) throw ApiError.conflict('You have already reviewed this product');

  let isVerifiedPurchase = false;
  if (order) {
    const foundOrder = await Order.findOne({
      _id: order,
      user: userId,
      orderStatus: 'delivered',
      'items.product': product,
    });
    isVerifiedPurchase = !!foundOrder;
  }

  const review = await Review.create({
    product,
    user: userId,
    order: order || null,
    rating,
    title,
    comment,
    isVerifiedPurchase,
  });

  await recalculateProductRatings(product);
  return review;
};

export const updateReview = async (userId, reviewId, updates) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) throw ApiError.notFound('Review not found');

  Object.assign(review, updates);
  await review.save();
  await recalculateProductRatings(review.product);
  return review;
};

export const deleteReview = async (reviewId, requester) => {
  const review = await Review.findById(reviewId);
  if (!review) throw ApiError.notFound('Review not found');

  const isOwner = review.user.toString() === requester.id;
  if (!isOwner && !['admin', 'manager'].includes(requester.role)) {
    throw ApiError.forbidden('You do not have permission to delete this review');
  }

  await review.deleteOne();
  await recalculateProductRatings(review.product);
  return review;
};

export const setReviewApproval = async (reviewId, isApproved) => {
  const review = await Review.findByIdAndUpdate(reviewId, { isApproved }, { new: true });
  if (!review) throw ApiError.notFound('Review not found');
  await recalculateProductRatings(review.product);
  return review;
};

export const replyToReview = async (reviewId, adminReply) => {
  const review = await Review.findByIdAndUpdate(reviewId, { adminReply }, { new: true });
  if (!review) throw ApiError.notFound('Review not found');
  return review;
};
