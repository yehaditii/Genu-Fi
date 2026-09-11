import { useState } from "react";
import { MessageSquare } from "lucide-react";
import FeedbackModal from "@/components/FeedbackModal";

const Footer = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-aqua-neon/20 bg-gradient-to-t from-deep-navy to-cool-blue/20 section-padding">
        <div className="container mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-3xl font-bold text-neon">GenuFi</div>
            <p className="mt-2 max-w-xl text-soft-neon/80">
              Verifiable skill passports, institution trust, and recruiter verification on Stellar.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-soft-neon/60 md:items-end">
            <p>Freighter wallet for browser users</p>
            <p>Stellar Soroban contracts for credentials and reputation</p>
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="mt-1 flex items-center gap-1.5 text-xs text-aqua-neon hover:underline"
            >
              <MessageSquare size={13} />
              <span>Share Product Feedback</span>
            </button>
          </div>
        </div>
      </footer>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        featureContext="footer"
      />
    </>
  );
};

export default Footer;
