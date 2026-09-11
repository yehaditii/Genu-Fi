import { useRef, useState, type FormEvent } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import { useStellar } from "@/context/StellarContext";
import { track } from "@/lib/analytics";
import { captureError } from "@/lib/monitoring";
import { stellarService } from "@/services/stellarService";
import type { Credential, ReputationScore } from "@/types/credential";

type VerificationState = { status: "idle" | "preparing" | "awaiting_signature" | "confirming" | "success" | "error"; message?: string; isValid?: boolean; txHash?: string };

const RecruiterDashboard = () => {
  const { publicKey, isConnected, connectWallet, signTransaction } = useStellar();
  const [candidateAddress, setCandidateAddress] = useState("");
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [reputation, setReputation] = useState<ReputationScore | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [verification, setVerification] = useState<Record<string, VerificationState>>({});
  const verificationInProgress = useRef(new Set<string>());

  const searchCandidate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchError(null);
    setCredentials([]);
    setReputation(null);
    if (!candidateAddress) {
      setSearchError("Enter a candidate Stellar address.");
      return;
    }
    if (!/^G[A-Z2-7]{55}$/.test(candidateAddress)) {
      setSearchError("Enter a valid Stellar public address beginning with G.");
      return;
    }
    setIsSearching(true);
    track("recruiter_search", { network: "TESTNET" });
    try {
      const [loadedCredentials, loadedReputation] = await Promise.all([
        stellarService.getCredentialsByRecipient(candidateAddress),
        stellarService.getReputation(candidateAddress),
      ]);
      setCredentials(loadedCredentials);
      setReputation(loadedReputation);
      track("candidate_profile_viewed", { credential_count: loadedCredentials.length });
    } catch (requestError) {
      setSearchError(requestError instanceof Error ? requestError.message : "Candidate passport could not be loaded.");
    } finally {
      setIsSearching(false);
    }
  };

  const verify = async (credential: Credential) => {
    if (!publicKey) {
      setSearchError("Connect the recruiter wallet before verifying.");
      return;
    }
    const id = credential.credentialId;
    if (verificationInProgress.current.has(id)) return;
    verificationInProgress.current.add(id);
    setVerification((current) => ({ ...current, [id]: { status: "preparing" } }));
    track("credential_verification_started", { network: "TESTNET" });
    try {
      const prepared = await stellarService.prepareVerification(id, publicKey);
      setVerification((current) => ({ ...current, [id]: { status: "awaiting_signature" } }));
      const signedTransactionXdr = await signTransaction(prepared.transaction.transactionXdr);
      setVerification((current) => ({ ...current, [id]: { status: "confirming" } }));
      const submitted = await stellarService.submitVerification({ credentialId: id, requesterAddress: publicKey, signedTransactionXdr });
      setVerification((current) => ({ ...current, [id]: { status: "success", isValid: prepared.transaction.isValid, txHash: submitted.result.txHash } }));
      track("credential_verified", { valid: Boolean(prepared.transaction.isValid), network: "TESTNET" });
    } catch (requestError) {
      setVerification((current) => ({ ...current, [id]: { status: "error", message: requestError instanceof Error ? requestError.message : "Verification failed." } }));
      track("credential_verification_failed", { network: "TESTNET" });
      captureError(requestError, { category: "stellar_transaction_error", operation: "credential_verification" });
    } finally {
      verificationInProgress.current.delete(id);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto space-y-6 sm:space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-neon/60 sm:text-sm">Recruiter Dashboard</p>
            <h1 className="dashboard-heading mt-1.5 text-2xl font-bold text-neon sm:mt-2 sm:text-3xl lg:text-4xl">Verify Talent and Credential Trust</h1>
            <p className="mt-2 text-xs text-soft-neon/70 sm:mt-3 sm:text-sm">Recruiter wallet: {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "Not connected"} · Network: Stellar TESTNET</p>
          </div>
          {!isConnected && (
            <div className="glass-effect rounded-2xl p-4 sm:p-6">
              <p className="text-xs text-soft-neon/80 sm:text-sm">Connect a recruiter wallet to sign verification records.</p>
              <button className="btn-primary mt-3 w-full text-xs sm:mt-4 sm:w-auto sm:text-sm" type="button" onClick={() => void connectWallet()}>Connect recruiter wallet</button>
            </div>
          )}
          <div className="glass-effect rounded-2xl p-4 sm:p-6">
            <form className="flex flex-col gap-3 sm:gap-4 md:flex-row" onSubmit={searchCandidate} noValidate>
              <label className="min-w-0 flex-1">
                <span className="sr-only">Candidate Stellar address</span>
                <input required value={candidateAddress} onChange={(event) => setCandidateAddress(event.target.value.trim())} className="form-control text-base sm:text-sm" placeholder="Candidate Stellar address (G...)" aria-label="Candidate Stellar address" />
              </label>
              <button className="btn-primary w-full text-xs sm:w-auto sm:text-sm" type="submit" disabled={isSearching}>{isSearching ? "Searching..." : "Open skill passport"}</button>
            </form>
            {searchError && <p role="alert" className="status-panel status-panel-error mt-3.5 break-words text-xs sm:mt-4 sm:text-sm">{searchError}</p>}
          </div>
          {isSearching && <div className="flex justify-center py-6 sm:py-8" aria-live="polite"><LoadingSpinner /><span className="sr-only">Loading candidate passport...</span></div>}
          {reputation && (
            <div className="glass-effect rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-soft-neon/60 sm:text-sm">Candidate reputation</p>
                  <p className="mt-1 text-xs text-soft-neon/70 sm:mt-2 sm:text-sm">Read from the deployed reputation contract.</p>
                </div>
                <div className="self-start sm:self-auto">
                  <TrustScoreBadge score={reputation.totalScore} />
                </div>
              </div>
            </div>
          )}
          {!isSearching && candidateAddress && !searchError && credentials.length === 0 && (
            <div className="glass-effect rounded-2xl p-4 sm:p-6 text-xs text-soft-neon/80 sm:text-sm">No on-chain credentials were found for this address.</div>
          )}
          {credentials.length > 0 && (
            <div className="glass-effect rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl font-bold text-neon sm:text-2xl">Credentials</h2>
              <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                {credentials.map((credential) => {
                  const state = verification[credential.credentialId] || { status: "idle" as const };
                  return (
                    <div key={credential.credentialId} className="rounded-xl border border-aqua-neon/20 p-3.5 sm:p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="font-semibold text-soft-neon text-base">{credential.credentialType}</p>
                          <p className="break-all text-xs text-soft-neon/60 sm:text-sm">ID: {credential.credentialId}</p>
                          <p className="break-all font-mono text-[11px] text-soft-neon/50 sm:text-xs">Issuer: {credential.issuerAddress || credential.issuer}</p>
                          <p className="text-xs text-aqua-neon sm:text-sm">On-chain status: {credential.status}</p>
                        </div>
                        <button
                          className="btn-primary w-full text-xs sm:text-sm md:w-fit"
                          type="button"
                          disabled={!isConnected || state.status === "preparing" || state.status === "awaiting_signature" || state.status === "confirming"}
                          onClick={() => void verify(credential)}
                        >
                          {state.status === "preparing" ? "Preparing..." : state.status === "awaiting_signature" ? "Awaiting signature" : state.status === "confirming" ? "Confirming..." : state.status === "success" ? "Verified" : "Verify credential"}
                        </button>
                      </div>
                      {state.status === "awaiting_signature" && <p aria-live="polite" className="status-panel status-panel-info mt-3 text-xs sm:text-sm">Approve the verification transaction in Freighter.</p>}
                      {state.status === "success" && (
                        <div aria-live="polite" className={`status-panel mt-3 text-xs sm:text-sm ${state.isValid ? "status-panel-success" : "status-panel-error"}`}>
                          <p>Verification result: {state.isValid ? "Valid" : "Invalid or revoked"}</p>
                          <p className="mt-1 break-all font-mono">Transaction hash: {state.txHash}</p>
                          <p className="mt-2 text-xs uppercase">Confirmed on Stellar Testnet</p>
                        </div>
                      )}
                      {state.status === "error" && <p role="alert" className="status-panel status-panel-error mt-3 break-words text-xs sm:text-sm">{state.message}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
