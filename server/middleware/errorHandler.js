// runs when no route matched the request
function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// catches every error thrown in our routes and sends a clean JSON response
function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  // log unexpected errors so we can debug them
  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    // don't show internal error details to users
    message: status === 500 ? 'Something went wrong on the server.' : err.message,
  });
}

module.exports = { notFound, errorHandler };