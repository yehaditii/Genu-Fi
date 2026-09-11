export interface FeedbackPayload {
  rating: number;
  liked?: string;
  improve?: string;
  walletAddress?: string | null;
  featureUsed?: string;
  clientSubmissionId?: string;
}

export interface FeedbackRecord {
  id: string;
  rating: number;
  liked: string;
  improve: string;
  walletAddress: string | null;
  featureUsed: string;
  createdAt: string;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
  feedback?: FeedbackRecord;
  error?: {
    code: string;
    message: string;
  };
}

export interface FeedbackStats {
  totalSubmissions: number;
  averageRating: number;
  distribution: Record<number, number>;
}
