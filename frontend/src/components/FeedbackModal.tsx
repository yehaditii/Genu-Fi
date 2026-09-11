import { useState, useId, useEffect } from "react";
import { Star, X, CheckCircle, AlertCircle, Loader2, Shield, MessageSquarePlus } from "lucide-react";
import { useStellar } from "@/context/StellarContext";
import { feedbackService } from "@/services/feedbackService";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureContext?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "Needs Major Work",
  2: "Below Expectations",
  3: "Good & Functional",
  4: "Very Good Experience",
  5: "Excellent!",
};

export default function FeedbackModal({
  isOpen,
  onClose,
  featureContext = "general",
}: FeedbackModalProps) {
  const { publicKey } = useStellar();
  const formId = useId();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [attachWallet, setAttachWallet] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setLiked("");
    setImprove("");
    setError(null);
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    // Duplicate accidental submission cooldown guard (10 seconds)
    const now = Date.now();
    if (lastSubmissionTime && now - lastSubmissionTime < 10000) {
      setError("Please wait a few seconds before submitting again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const clientSubmissionId = `sub_${now}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      await feedbackService.submitFeedback({
        rating,
        liked: liked.trim(),
        improve: improve.trim(),
        walletAddress: attachWallet && publicKey ? publicKey : null,
        featureUsed: featureContext,
        clientSubmissionId,
      });

      setLastSubmissionTime(now);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <div className="glass-effect relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-aqua-neon/30 bg-[#001c30]/95 p-4 shadow-2xl sm:p-7">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-3 top-3 rounded-lg p-2 text-soft-neon/70 transition hover:bg-aqua-neon/10 hover:text-aqua-neon disabled:opacity-50 sm:right-4 sm:top-4"
          aria-label="Close feedback modal"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="py-4 text-center sm:py-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 sm:h-16 sm:w-16">
              <CheckCircle size={32} />
            </div>
            <h3
              id={`${formId}-title`}
              className="mt-4 text-xl font-bold text-neon sm:text-2xl"
            >
              Thank You for Your Feedback!
            </h3>
            <p className="mt-2 text-xs text-soft-neon/80 sm:text-sm">
              Your insights directly help us build and improve verifiable credentials on GenuFi.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:justify-center sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                }}
                className="btn-secondary w-full text-xs sm:w-auto sm:text-sm"
              >
                Send Another Response
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary w-full text-xs sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-aqua-neon/10 text-aqua-neon sm:h-10 sm:w-10">
                <MessageSquarePlus size={20} />
              </div>
              <div>
                <h2
                  id={`${formId}-title`}
                  className="text-xl font-bold text-neon sm:text-2xl"
                >
                  Share Your Feedback
                </h2>
                <p className="text-[11px] text-soft-neon/70 sm:text-xs">
                  Help us refine GenuFi's decentralized verification experience.
                </p>
              </div>
            </div>

            {/* Privacy note */}
            <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-aqua-neon/20 bg-deep-navy/40 p-2.5 text-[11px] text-soft-neon/80 sm:mt-4 sm:gap-2.5 sm:p-3 sm:text-xs">
              <Shield size={15} className="mt-0.5 shrink-0 text-aqua-neon" />
              <span>
                <strong>Privacy Guaranteed:</strong> We never collect private keys, seed phrases, passwords, or sensitive personal information.
              </span>
            </div>

            {error && (
              <div
                role="alert"
                className="status-panel status-panel-error mt-3.5 flex items-center gap-2 text-xs sm:mt-4"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
              {/* Rating 1-5 */}
              <div>
                <label className="block text-xs font-medium text-soft-neon sm:text-sm">
                  Overall Rating <span className="text-aqua-neon">*</span>
                </label>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-2 sm:gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={isSubmitting}
                        className="group rounded-lg p-0.5 transition hover:scale-110 focus:outline-none sm:p-1"
                        aria-label={`Rate ${star} out of 5 stars - ${RATING_LABELS[star]}`}
                      >
                        <Star
                          size={24}
                          className={`transition-colors duration-150 sm:h-7 sm:w-7 ${
                            star <= activeRating
                              ? "fill-aqua-neon text-aqua-neon drop-shadow-[0_0_8px_rgba(100,204,197,0.6)]"
                              : "text-soft-neon/30 hover:text-soft-neon/60"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {activeRating > 0 && (
                    <span className="text-xs font-semibold text-aqua-neon">
                      {RATING_LABELS[activeRating]}
                    </span>
                  )}
                </div>
              </div>

              {/* What did you like */}
              <div>
                <div className="flex justify-between text-xs font-medium text-soft-neon sm:text-sm">
                  <label htmlFor={`${formId}-liked`}>What did you like?</label>
                  <span className="text-[11px] text-soft-neon/50">
                    {liked.length}/2000
                  </span>
                </div>
                <textarea
                  id={`${formId}-liked`}
                  value={liked}
                  onChange={(e) => setLiked(e.target.value.slice(0, 2000))}
                  placeholder="Tell us what worked well (e.g. fast verification, clean UI, smooth wallet connection)..."
                  rows={3}
                  disabled={isSubmitting}
                  className="form-control mt-1 resize-none text-base sm:text-sm"
                />
              </div>

              {/* What should we improve */}
              <div>
                <div className="flex justify-between text-xs font-medium text-soft-neon sm:text-sm">
                  <label htmlFor={`${formId}-improve`}>What should we improve?</label>
                  <span className="text-[11px] text-soft-neon/50">
                    {improve.length}/2000
                  </span>
                </div>
                <textarea
                  id={`${formId}-improve`}
                  value={improve}
                  onChange={(e) => setImprove(e.target.value.slice(0, 2000))}
                  placeholder="Suggestions, friction points, feature requests..."
                  rows={3}
                  disabled={isSubmitting}
                  className="form-control mt-1 resize-none text-base sm:text-sm"
                />
              </div>

              {/* Wallet Association Context */}
              <div className="rounded-xl border border-aqua-neon/15 bg-deep-navy/30 p-2.5 sm:p-3">
                {publicKey ? (
                  <label className="flex cursor-pointer items-center gap-2.5 sm:gap-3">
                    <input
                      type="checkbox"
                      checked={attachWallet}
                      onChange={(e) => setAttachWallet(e.target.checked)}
                      disabled={isSubmitting}
                      className="h-4 w-4 rounded border-aqua-neon/40 text-aqua-neon accent-[#64ccc5]"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-soft-neon">
                        Associate connected wallet address
                      </p>
                      <p className="break-all font-mono text-soft-neon/60">
                        {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="text-xs text-soft-neon/70">
                    <p className="font-semibold text-soft-neon">
                      Submitting as Anonymous
                    </p>
                    <p className="text-[11px] text-soft-neon/50 sm:text-xs">
                      No Stellar wallet is currently connected.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="btn-secondary min-h-10 w-full px-4 py-2 text-xs sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="btn-primary min-h-10 w-full gap-2 px-5 py-2 text-xs sm:w-auto sm:text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
