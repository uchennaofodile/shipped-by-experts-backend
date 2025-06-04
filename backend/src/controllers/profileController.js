import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { oldPassword, newPassword } = req.body;
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Old password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};
