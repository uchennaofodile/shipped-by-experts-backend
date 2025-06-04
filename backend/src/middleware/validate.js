// Simple input validation middleware for required fields
export const requireFields = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }
  next();
};
