import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import '../config/passport.js';

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
  // Issue JWT
  const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  // Redirect or respond with token
  res.redirect(`/oauth-success?token=${token}`); // Or send JSON: res.json({ token })
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/login' }), (req, res) => {
  // Issue JWT
  const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  // Redirect or respond with token
  res.redirect(`/oauth-success?token=${token}`); // Or send JSON: res.json({ token })
});

export default router;
