import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, firstName, lastName } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    let user;
    if (role === 'customer') {
      if (!firstName || !lastName) {
        return res.status(400).json({ error: 'First name and last name are required for customers' });
      }
      user = await User.create({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        password: hashed,
        role
      });
    } else {
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      user = await User.create({ name, email, password: hashed, role });
    }
    res.status(201).json({ id: user.id, name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
