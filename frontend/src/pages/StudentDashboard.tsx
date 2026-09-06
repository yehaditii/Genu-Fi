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
        <div className="container mx-auto space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Student Dashboard</p>
            <h1 className="dashboard-heading mt-2 text-3xl font-bold text-neon sm:text-4xl">Verifiable Skill Passport</h1>
            <p className="mt-3 text-sm text-soft-neon/70">Wallet: {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "Not connected"} · Network: Stellar TESTNET</p>
          </div>
          {!isConnected ? (
            <div className="glass-effect rounded-2xl p-6"><p className="text-soft-neon/80">Connect your Stellar wallet to load your on-chain passport.</p><button className="btn-primary mt-4" type="button" onClick={() => void connectWallet()}>Connect wallet</button></div>
          ) : isLoading ? (
            <div className="glass-effect rounded-2xl p-6" aria-live="polite"><div className="skeleton h-7 w-48" /><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="skeleton h-16" /><div className="skeleton h-16" /><div className="skeleton h-16" /></div><div className="mt-6 flex justify-center"><LoadingSpinner /></div><p className="mt-4 text-center text-sm text-soft-neon/70">Reading your credentials from Stellar Testnet...</p></div>
          ) : error ? (
            <div role="alert" className="status-panel status-panel-error">{error}</div>
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
