import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReputationScore from "@/components/ReputationScore";
import SkillPassport from "@/components/SkillPassport";
import { useStellar } from "@/context/StellarContext";
import { stellarService } from "@/services/stellarService";
import type { Credential, ReputationScore as ReputationScoreType } from "@/types/credential";

const StudentDashboard = () => {
  const { publicKey, isConnected, connectWallet } = useStellar();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [reputation, setReputation] = useState<ReputationScoreType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setCredentials([]);
      setReputation(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    Promise.all([stellarService.getCredentialsByRecipient(publicKey), stellarService.getReputation(publicKey)])
      .then(([loadedCredentials, loadedReputation]) => {
        if (cancelled) return;
        setCredentials(loadedCredentials);
        setReputation(loadedReputation);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Passport data could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto space-y-6 sm:space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-neon/60 sm:text-sm">Student Dashboard</p>
            <h1 className="dashboard-heading mt-1.5 text-2xl font-bold text-neon sm:mt-2 sm:text-3xl lg:text-4xl">Verifiable Skill Passport</h1>
            <p className="mt-2 text-xs text-soft-neon/70 sm:mt-3 sm:text-sm">Wallet: {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "Not connected"} · Network: Stellar TESTNET</p>
          </div>
          {!isConnected ? (
            <div className="glass-effect rounded-2xl p-4 sm:p-6">
              <p className="text-xs text-soft-neon/80 sm:text-sm">Connect your Stellar wallet to load your on-chain passport.</p>
              <button className="btn-primary mt-3 w-full text-xs sm:mt-4 sm:w-auto sm:text-sm" type="button" onClick={() => void connectWallet()}>Connect wallet</button>
            </div>
          ) : isLoading ? (
            <div className="glass-effect rounded-2xl p-4 sm:p-6" aria-live="polite">
              <div className="skeleton h-6 w-36 sm:h-7 sm:w-48" />
              <div className="mt-4 grid gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3">
                <div className="skeleton h-14 sm:h-16" />
                <div className="skeleton h-14 sm:h-16" />
                <div className="skeleton h-14 sm:h-16" />
              </div>
              <div className="mt-6 flex justify-center"><LoadingSpinner /></div>
              <p className="mt-4 text-center text-xs text-soft-neon/70 sm:text-sm">Reading your credentials from Stellar Testnet...</p>
            </div>
          ) : error ? (
            <div role="alert" className="status-panel status-panel-error text-xs sm:text-sm">{error}</div>
          ) : (
            <>
              {reputation && <ReputationScore score={reputation} />}
              <SkillPassport credentials={credentials} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
