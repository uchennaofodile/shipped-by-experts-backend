import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ where: { email } });
    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      user = await User.create({
        name: profile.displayName,
        email,
        googleId: profile.id,
        role: 'customer', // Default role, adjust as needed
        password: '', // Not used for OAuth
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ where: { email } });
    if (user) {
      // Link Facebook ID if not already linked
      if (!user.facebookId) {
        user.facebookId = profile.id;
        await user.save();
      }
    } else {
      user = await User.create({
        name: profile.displayName,
        email,
        facebookId: profile.id,
        role: 'customer', // Default role, adjust as needed
        password: '', // Not used for OAuth
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

export default passport;
