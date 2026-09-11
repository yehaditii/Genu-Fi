import { useRef, useState, type FormEvent } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InstitutionCard from "@/components/InstitutionCard";
import { useStellar } from "@/context/StellarContext";
import { track } from "@/lib/analytics";
import { captureError } from "@/lib/monitoring";
import { stellarService } from "@/services/stellarService";

type IssuanceState = "idle" | "preparing" | "awaiting_signature" | "confirming" | "success" | "error";

async function hashCredential(payload: Record<string, string>) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const InstitutionDashboard = () => {
  const { publicKey, isConnected, connectWallet, signTransaction } = useStellar();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [credentialType, setCredentialType] = useState("");
  const [metadata, setMetadata] = useState("");
  const [state, setState] = useState<IssuanceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ credentialId: string; txHash: string } | null>(null);
  const submissionInProgress = useRef(false);

  const issueCredential = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInProgress.current) return;
    setError(null);
    setResult(null);
    if (!isConnected || !publicKey) {
      setError("Connect the issuing institution wallet before submitting.");
      return;
    }
    if (!recipientAddress || !credentialType || !metadata) {
      setError("Recipient address, credential type, and metadata are required.");
      return;
    }
    if (!/^G[A-Z2-7]{55}$/.test(recipientAddress)) {
      setError("Enter a valid Stellar public address beginning with G.");
      return;
    }

    const credentialId = String(Date.now());
    const payload = { credentialId, issuerAddress: publicKey, recipientAddress, credentialType, metadata };
    submissionInProgress.current = true;
    try {
      track("credential_issue_started", { network: "TESTNET" });
      setState("preparing");
      const credentialHash = await hashCredential(payload);
      const prepared = await stellarService.prepareCredentialIssuance({ ...payload, credentialHash });
      setState("awaiting_signature");
      const signedTransactionXdr = await signTransaction(prepared.transaction.transactionXdr);
      setState("confirming");
      const submitted = await stellarService.submitCredentialIssuance({ ...payload, credentialHash, signedTransactionXdr });
      setResult({ credentialId, txHash: submitted.tx.txHash });
      setState("success");
      track("credential_issued", { network: "TESTNET" });
    } catch (requestError) {
      setState("error");
      setError(requestError instanceof Error ? requestError.message : "Credential issuance failed.");
      track("credential_issue_failed", { network: "TESTNET" });
      captureError(requestError, { category: "stellar_transaction_error", operation: "credential_issue" });
    } finally {
      submissionInProgress.current = false;
    }
  };

  const statusMessage = {
    idle: "",
    preparing: "Preparing Soroban transaction...",
    awaiting_signature: "Approve the transaction in Freighter...",
    confirming: "Waiting for Stellar Testnet confirmation...",
    success: "Credential issued and confirmed on Stellar Testnet.",
    error: "Credential issuance failed.",
  }[state];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto space-y-6 sm:space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-neon/60 sm:text-sm">Institution Dashboard</p>
            <h1 className="dashboard-heading mt-1.5 text-2xl font-bold text-neon sm:mt-2 sm:text-3xl lg:text-4xl">Issue and Manage Credentials</h1>
            <p className="mt-2 text-xs text-soft-neon/70 sm:mt-3 sm:text-sm">Network: Stellar {"TESTNET"} · Issuer wallet: {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "Not connected"}</p>
          </div>
          <InstitutionCard name="Connected issuer" type="Stellar institution" isVerified={false} />
          <div className="glass-effect rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-bold text-neon sm:text-2xl">Issue Credential</h2>
            <p className="mt-1.5 text-xs text-soft-neon/70 sm:mt-2 sm:text-sm">The connected wallet signs the credential transaction.</p>
            <form className="mt-5 grid gap-4 md:grid-cols-2 sm:mt-6" onSubmit={issueCredential} noValidate>
              <label className="grid gap-1.5 text-xs text-soft-neon/80 sm:text-sm">Candidate wallet address<input required value={recipientAddress} onChange={(event) => setRecipientAddress(event.target.value.trim())} className="form-control text-base sm:text-sm" placeholder="G..." aria-label="Recipient Stellar address" /></label>
              <label className="grid gap-1.5 text-xs text-soft-neon/80 sm:text-sm">Credential or skill type<input required value={credentialType} onChange={(event) => setCredentialType(event.target.value)} className="form-control text-base sm:text-sm" placeholder="Course completion" aria-label="Credential or skill type" /></label>
              <label className="grid gap-1.5 text-xs text-soft-neon/80 md:col-span-2 sm:text-sm">Credential metadata<textarea required value={metadata} onChange={(event) => setMetadata(event.target.value)} className="form-control resize-none text-base sm:text-sm" placeholder="Metadata URI or credential description" aria-label="Metadata URI or credential description" rows={4} /></label>
              <button className="btn-primary w-full md:w-fit" type="submit" disabled={state === "preparing" || state === "awaiting_signature" || state === "confirming"}>{state === "preparing" || state === "confirming" ? "Processing..." : "Submit Soroban Issuance"}</button>
            </form>
            {!isConnected && <button className="btn-secondary mt-4 w-full sm:w-auto" type="button" onClick={() => void connectWallet()}>Connect issuing wallet</button>}
            {statusMessage && <p aria-live="polite" className={`status-panel mt-4 text-xs sm:text-sm ${state === "error" ? "status-panel-error" : state === "success" ? "status-panel-success" : "status-panel-info"}`}>{statusMessage}</p>}
            {error && <p role="alert" className="status-panel status-panel-error mt-2 break-words text-xs sm:text-sm">{error}</p>}
            {result && <div aria-live="polite" className="status-panel status-panel-success mt-4 text-xs sm:text-sm"><p className="break-all">Credential ID: {result.credentialId}</p><p className="mt-1 break-all font-mono">Transaction hash: {result.txHash}</p><p className="mt-2 text-xs uppercase">Confirmed on Stellar Testnet</p></div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstitutionDashboard;
