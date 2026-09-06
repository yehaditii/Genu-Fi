const { env } = require("../config/env");

function errorHandler(err, _req, res, _next) {
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const code = err.code || (statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR");
  const message =
    env.nodeEnv === "production" && statusCode >= 500
      ? "Internal server error"
      : err.message || "Request failed";

  console.error(err.stack || err);
  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}

module.exports = { errorHandler };
