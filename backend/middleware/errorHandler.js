const { env } = require("../config/env");
const { captureError } = require("../services/monitoring");

function errorHandler(err, _req, res, _next) {
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const code = err.code || (statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR");
  const message =
    env.nodeEnv === "production" && statusCode >= 500
      ? "Internal server error"
      : err.message || "Request failed";

  if (statusCode >= 500) {
    captureError(err, { category: "api_failure", status: statusCode, error_code: code });
  }
  console.error(statusCode >= 500 ? "Unhandled API error." : "Handled API error.");
  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}

module.exports = { errorHandler };
