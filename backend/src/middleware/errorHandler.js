// Centralized error handler middleware
module.exports = (err, req, res, next) => {
  // Log the error (extend this to use a logging service in production)
  console.error('Error:', err);

  // Set status code (default to 500)
  const status = err.status || 500;

  // Do not leak stack traces or sensitive info in production
  const response = {
    error: err.isPublic ? err.message : 'An unexpected error occurred. Please try again.'
  };

  // Optionally include stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};
