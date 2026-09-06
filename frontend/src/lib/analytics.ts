export type AnalyticsEvent =
  | "wallet_connected"
  | "wallet_disconnected"
  | "credential_issue_started"
  | "credential_issued"
  | "credential_issue_failed"
  | "credential_viewed"
  | "credential_verification_started"
  | "credential_verified"
  | "credential_verification_failed"
  | "recruiter_search"
  | "candidate_profile_viewed"
  | "feedback_opened"
  | "feedback_submitted";

type AnalyticsProperties = Record<string, string | number | boolean>;

type PlausibleFunction = ((event: string, options?: { props?: AnalyticsProperties }) => void) & {
  q?: unknown[];
};

interface PlausibleWindow extends Window {
  plausible?: PlausibleFunction;
}

const scriptId = "genufi-plausible-script";
let scriptPromise: Promise<void> | null = null;

function analyticsConfigured() {
  return Boolean(import.meta.env.VITE_ANALYTICS_ENABLED === "true" && import.meta.env.VITE_PLAUSIBLE_DOMAIN);
}

function loadProvider() {
  if (!analyticsConfigured() || typeof document === "undefined") return Promise.resolve();
  if (document.getElementById(scriptId)) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const plausibleWindow = window as PlausibleWindow;
    if (!plausibleWindow.plausible) {
      const queueingPlausible = ((...args: unknown[]) => {
        queueingPlausible.q?.push(args);
      }) as PlausibleFunction;
      queueingPlausible.q = [];
      plausibleWindow.plausible = queueingPlausible;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.defer = true;
    script.dataset.domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    script.src = import.meta.env.VITE_PLAUSIBLE_SCRIPT_URL || "https://plausible.io/js/script.js";
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function track(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
  if (!analyticsConfigured()) return;

  void loadProvider().then(() => {
    try {
      (window as PlausibleWindow).plausible?.(event, { props: properties });
    } catch {
      // Analytics must never affect product functionality.
    }
  });
}