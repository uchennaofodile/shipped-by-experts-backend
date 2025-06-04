// Simple in-memory rate limiter (for demonstration; use Redis for production)
const rateLimitMap = new Map();

export const rateLimit = (windowMs = 60000, max = 60) => (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  const timestamps = rateLimitMap.get(ip).filter(ts => now - ts < windowMs);
  if (timestamps.length >= max) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  next();
};
