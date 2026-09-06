import { useState, type FormEvent } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import { useStellar } from "@/context/StellarContext";
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

  const searchCandidate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchError(null);
    setCredentials([]);
    setReputation(null);
    if (!candidateAddress) {
      setSearchError("Enter a candidate Stellar address.");
      return;
    }
    setIsSearching(true);
    try {
      const [loadedCredentials, loadedReputation] = await Promise.all([
        stellarService.getCredentialsByRecipient(candidateAddress),
        stellarService.getReputation(candidateAddress),
      ]);
      setCredentials(loadedCredentials);
      setReputation(loadedReputation);
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
    setVerification((current) => ({ ...current, [id]: { status: "preparing" } }));
    try {
      const prepared = await stellarService.prepareVerification(id, publicKey);
      setVerification((current) => ({ ...current, [id]: { status: "awaiting_signature" } }));
      const signedTransactionXdr = await signTransaction(prepared.transaction.transactionXdr);
      setVerification((current) => ({ ...current, [id]: { status: "confirming" } }));
      const submitted = await stellarService.submitVerification({ credentialId: id, requesterAddress: publicKey, signedTransactionXdr });
      setVerification((current) => ({ ...current, [id]: { status: "success", isValid: prepared.transaction.isValid, txHash: submitted.result.txHash } }));
    } catch (requestError) {
      setVerification((current) => ({ ...current, [id]: { status: "error", message: requestError instanceof Error ? requestError.message : "Verification failed." } }));
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Recruiter Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-neon">Verify Talent and Credential Trust</h1>
          </div>
          {!isConnected && <div className="glass-effect rounded-2xl p-6"><p className="text-soft-neon/80">Connect a recruiter wallet to sign verification records.</p><button className="btn-primary mt-4" type="button" onClick={() => void connectWallet()}>Connect recruiter wallet</button></div>}
          <div className="glass-effect rounded-2xl p-6">
            <form className="flex flex-col gap-4 md:flex-row" onSubmit={searchCandidate}>
              <input value={candidateAddress} onChange={(event) => setCandidateAddress(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3" placeholder="Candidate Stellar address" aria-label="Candidate Stellar address" />
              <button className="btn-primary" type="submit" disabled={isSearching}>{isSearching ? "Searching..." : "Open skill passport"}</button>
            </form>
            {searchError && <p className="mt-4 break-words text-sm text-red-300">{searchError}</p>}
          </div>
          {isSearching && <div className="flex justify-center py-8"><LoadingSpinner /></div>}
          {reputation && <div className="glass-effect rounded-2xl p-6"><div className="flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Candidate reputation</p><p className="mt-2 text-soft-neon/70">Read from the deployed reputation contract.</p></div><TrustScoreBadge score={reputation.totalScore} /></div></div>}
          {!isSearching && candidateAddress && !searchError && credentials.length === 0 && <div className="glass-effect rounded-2xl p-6 text-soft-neon/80">No on-chain credentials were found for this address.</div>}
          {credentials.length > 0 && <div className="glass-effect rounded-2xl p-6"><h2 className="text-2xl font-bold text-neon">Credentials</h2><div className="mt-6 space-y-4">{credentials.map((credential) => { const state = verification[credential.credentialId] || { status: "idle" as const }; return <div key={credential.credentialId} className="rounded-xl border border-aqua-neon/20 p-4"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold text-soft-neon">{credential.credentialType}</p><p className="text-sm text-soft-neon/60">ID: {credential.credentialId}</p><p className="text-sm text-soft-neon/60">Issuer: {credential.issuerAddress || credential.issuer}</p><p className="mt-1 text-sm text-aqua-neon">On-chain status: {credential.status}</p></div><button className="btn-primary md:w-fit" type="button" disabled={!isConnected || state.status === "preparing" || state.status === "awaiting_signature" || state.status === "confirming"} onClick={() => void verify(credential)}>{state.status === "confirming" ? "Confirming..." : state.status === "success" ? "Verified" : "Verify credential"}</button></div>{state.status === "awaiting_signature" && <p className="mt-3 text-sm text-aqua-neon">Approve the verification transaction in Freighter.</p>}{state.status === "success" && <div className="mt-3 text-sm"><p className={state.isValid ? "text-green-300" : "text-red-300"}>Verification result: {state.isValid ? "Valid" : "Invalid or revoked"}</p><p className="mt-1 break-all text-soft-neon/60">Transaction hash: {state.txHash}</p></div>}{state.status === "error" && <p className="mt-3 break-words text-sm text-red-300">{state.message}</p>}</div>; })}</div></div>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
