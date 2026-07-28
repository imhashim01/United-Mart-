import Notification from '../models/notificationModel.js';
import { ApiError } from '../../../utils/ApiError.js';

export const notifyUser = async ({ userId, title, message, type = 'system', link = null, meta = null }) =>
  Notification.create({ user: userId, title, message, type, link, meta });

export const notifyManyUsers = async (userIds, { title, message, type = 'promotion', link = null }) =>
  Notification.insertMany(userIds.map((userId) => ({ user: userId, title, message, type, link })));

export const getMyNotifications = async (userId, { unreadOnly = false } = {}) =>
  Notification.find({ user: userId, ...(unreadOnly ? { isRead: false } : {}) }).sort('-createdAt');

export const getUnreadCount = async (userId) => Notification.countDocuments({ user: userId, isRead: false });

export const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) throw ApiError.notFound('Notification not found');
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: new Date() });
  return { message: 'All notifications marked as read' };
};

export const deleteNotification = async (userId, notificationId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  if (!notification) throw ApiError.notFound('Notification not found');
  return notification;
};
