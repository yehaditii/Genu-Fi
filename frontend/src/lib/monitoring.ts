import * as Sentry from "@sentry/react";

type MonitoringContext = Record<string, string | number | boolean | undefined>;

let initialized = false;

function configured() {
  return Boolean(import.meta.env.VITE_SENTRY_DSN && import.meta.env.VITE_SENTRY_ENABLED === "true");
}

function safeContext(context: MonitoringContext) {
  return Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined).slice(0, 10)
  );
}

export function initMonitoring() {
  if (initialized || !configured()) return;
  initialized = true;

  try {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || (import.meta.env.PROD ? "production" : "development"),
      enabled: true,
      sendDefaultPii: false,
      tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0),
      beforeSend(event) {
        delete event.request?.data;
        delete event.request?.cookies;
        delete event.user;
        return event;
      },
    });
  } catch {
    // Monitoring must never prevent the application from starting.
  }
}

export function captureError(error: unknown, context: MonitoringContext = {}) {
  if (!configured()) return;

  try {
    const safeError = error instanceof Error ? new Error(error.name || "Application error") : new Error("Application error");
    Sentry.withScope((scope) => {
      scope.setTags({ component: "genufi-frontend" });
      scope.setExtras(safeContext(context));
      Sentry.captureException(safeError);
    });
  } catch {
    // Monitoring failures must never affect product behavior.
  }
}