function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
}

module.exports = { errorHandler };
