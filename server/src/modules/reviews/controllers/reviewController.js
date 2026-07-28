import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as reviewService from '../services/reviewService.js';

export const listReviews = asyncHandler(async (req, res) => {
  const { reviews, meta } = await reviewService.listReviews(req.query);
  sendResponse(res, 200, reviews, 'Reviews fetched', meta);
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { reviews, meta } = await reviewService.getProductReviews(req.params.productId, req.query);
  sendResponse(res, 200, reviews, 'Product reviews fetched', meta);
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  sendResponse(res, 201, review, 'Review submitted');
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(req.user.id, req.params.id, req.body);
  sendResponse(res, 200, review, 'Review updated');
});

export const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user);
  sendResponse(res, 200, null, 'Review deleted');
});

export const setReviewApproval = asyncHandler(async (req, res) => {
  const review = await reviewService.setReviewApproval(req.params.id, req.body.isApproved);
  sendResponse(res, 200, review, 'Review approval updated');
});

export const replyToReview = asyncHandler(async (req, res) => {
  const review = await reviewService.replyToReview(req.params.id, req.body.adminReply);
  sendResponse(res, 200, review, 'Reply added to review');
});
