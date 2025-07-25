import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      const err = new Error('Email already in use');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (!firstName || !lastName) {
      const err = new Error('First name and last name are required');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      const err = new Error('A valid email is required');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (!password || password.length < 6) {
      const err = new Error('Password must be at least 6 characters');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role: role || 'customer'
    });
    res.status(201).json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.isPublic = true;
      return next(err);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.isPublic = true;
      return next(err);
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};
