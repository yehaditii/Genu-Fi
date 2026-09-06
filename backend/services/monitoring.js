const Sentry = require("@sentry/node");
const { env } = require("../config/env");

let initialized = false;

function configured() {
  return Boolean(env.sentryDsn && env.sentryEnabled);
}

function safeContext(context = {}) {
  return Object.fromEntries(
    Object.entries(context)
      .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
      .slice(0, 10)
  );
}

function initMonitoring() {
  if (initialized || !configured()) return;
  initialized = true;

  try {
    Sentry.init({
      dsn: env.sentryDsn,
      environment: env.sentryEnvironment,
      enabled: true,
      sendDefaultPii: false,
      tracesSampleRate: env.sentryTracesSampleRate,
      beforeSend(event) {
        delete event.request?.data;
        delete event.request?.cookies;
        delete event.user;
        return event;
      },
    });
  } catch {
    // Monitoring must never prevent the backend from starting.
  }
}

function captureError(error, context = {}) {
  if (!configured()) return;

  try {
    const safeError = new Error(error instanceof Error ? error.name || "Application error" : "Application error");
    Sentry.withScope((scope) => {
      scope.setTags({ component: "genufi-backend" });
      scope.setExtras(safeContext(context));
      Sentry.captureException(safeError);
    });
  } catch {
    // Monitoring failures must never affect request handling or shutdown.
  }
}

module.exports = { captureError, initMonitoring };