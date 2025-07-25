import { Notification } from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { userId: req.user.id } });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    // Input validation
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }
    const notification = await Notification.findOne({ where: { id, userId: req.user.id } });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Notification markAsRead error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

export const sendNotification = async (userId, message) => {
  await Notification.create({ userId, message });
};
