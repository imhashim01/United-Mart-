import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as notificationService from '../services/notificationService.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getMyNotifications(req.user.id, {
    unreadOnly: req.query.unreadOnly === 'true',
  });
  sendResponse(res, 200, notifications, 'Notifications fetched');
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  sendResponse(res, 200, { count }, 'Unread count fetched');
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.user.id, req.params.id);
  sendResponse(res, 200, notification, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  sendResponse(res, 200, null, result.message);
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.user.id, req.params.id);
  sendResponse(res, 200, null, 'Notification deleted');
});
