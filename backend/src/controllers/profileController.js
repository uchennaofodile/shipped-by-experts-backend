import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      err.isPublic = true;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      err.isPublic = true;
      return next(err);
    }
    const { firstName, lastName, email } = req.body;
    // Input validation
    if (firstName && typeof firstName !== 'string') {
      const err = new Error('Invalid first name');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (lastName && typeof lastName !== 'string') {
      const err = new Error('Invalid last name');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      const err = new Error('Invalid email address');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      err.isPublic = true;
      return next(err);
    }
    const { oldPassword, newPassword } = req.body;
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      const err = new Error('Old password incorrect');
      err.status = 401;
      err.isPublic = true;
      return next(err);
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};
