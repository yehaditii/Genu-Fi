import { frontendEnv } from "@/config/env";
import { captureError } from "@/lib/monitoring";
import type { FeedbackPayload, FeedbackResponse, FeedbackStats } from "@/types/feedback";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = frontendEnv.apiUrl || "/api";

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch (error) {
    captureError(error, {
      category: "api_failure",
      endpoint: path,
      method: init?.method || "GET",
      failure: "network",
    });
    throw error;
  }

  const payload = (await response.json().catch(() => null)) as T & {
    error?: { message?: string; code?: string } | string;
    message?: string;
  };

  if (!response.ok) {
    const errorMessage =
      typeof payload?.error === "object" && payload.error?.message
        ? payload.error.message
        : typeof payload?.error === "string"
        ? payload.error
        : payload?.message || `Feedback request failed with status ${response.status}`;

    const customError = new Error(errorMessage);
    captureError(customError, {
      category: "feedback_api_error",
      status: response.status,
      endpoint: path,
    });
    throw customError;
  }

  return payload as T;
}

export const feedbackService = {
  async submitFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
    return request<FeedbackResponse>("/feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getFeedbackStats(): Promise<{ success: boolean; stats: FeedbackStats }> {
    return request<{ success: boolean; stats: FeedbackStats }>("/feedback/stats", {
      method: "GET",
    });
  },
};
