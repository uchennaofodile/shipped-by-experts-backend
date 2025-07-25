import { Notification } from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({ where: { userId: req.user.id } });
    res.json(notifications);
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Input validation
    if (!id || isNaN(Number(id))) {
      const err = new Error('Invalid notification ID');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    const notification = await Notification.findOne({ where: { id, userId: req.user.id } });
    if (!notification) {
      const err = new Error('Notification not found');
      err.status = 404;
      err.isPublic = true;
      return next(err);
    }
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const sendNotification = async (userId, message) => {
  await Notification.create({ userId, message });
};
