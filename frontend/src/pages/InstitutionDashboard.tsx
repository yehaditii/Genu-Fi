import { useState, type FormEvent } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InstitutionCard from "@/components/InstitutionCard";
import { useStellar } from "@/context/StellarContext";
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

  const issueCredential = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

    const credentialId = String(Date.now());
    const payload = { credentialId, issuerAddress: publicKey, recipientAddress, credentialType, metadata };
    try {
      setState("preparing");
      const credentialHash = await hashCredential(payload);
      const prepared = await stellarService.prepareCredentialIssuance({ ...payload, credentialHash });
      setState("awaiting_signature");
      const signedTransactionXdr = await signTransaction(prepared.transaction.transactionXdr);
      setState("confirming");
      const submitted = await stellarService.submitCredentialIssuance({ ...payload, credentialHash, signedTransactionXdr });
      setResult({ credentialId, txHash: submitted.tx.txHash });
      setState("success");
    } catch (requestError) {
      setState("error");
      setError(requestError instanceof Error ? requestError.message : "Credential issuance failed.");
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
        <div className="container mx-auto space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Institution Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-neon">Issue and Manage Credentials</h1>
          </div>
          <InstitutionCard name="Connected issuer" type="Stellar institution" isVerified={false} />
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-neon">Issue Credential</h2>
            <p className="mt-2 text-sm text-soft-neon/70">The connected wallet signs the credential transaction.</p>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={issueCredential}>
              <input value={recipientAddress} onChange={(event) => setRecipientAddress(event.target.value)} className="rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3" placeholder="Recipient Stellar address" aria-label="Recipient Stellar address" />
              <input value={credentialType} onChange={(event) => setCredentialType(event.target.value)} className="rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3" placeholder="Credential or skill type" aria-label="Credential or skill type" />
              <textarea value={metadata} onChange={(event) => setMetadata(event.target.value)} className="rounded-xl border border-aqua-neon/20 bg-deep-navy/50 p-3 md:col-span-2" placeholder="Metadata URI or credential description" aria-label="Metadata URI or credential description" rows={4} />
              <button className="btn-primary md:w-fit" type="submit" disabled={state === "preparing" || state === "awaiting_signature" || state === "confirming"}>{state === "preparing" || state === "confirming" ? "Processing..." : "Submit Soroban Issuance"}</button>
            </form>
            {!isConnected && <button className="btn-secondary mt-4" type="button" onClick={() => void connectWallet()}>Connect issuing wallet</button>}
            {statusMessage && <p className={`mt-4 text-sm ${state === "error" ? "text-red-300" : "text-aqua-neon"}`}>{statusMessage}</p>}
            {error && <p className="mt-2 break-words text-sm text-red-300">{error}</p>}
            {result && <div className="mt-4 rounded-xl border border-aqua-neon/30 p-4 text-sm text-soft-neon"><p>Credential ID: {result.credentialId}</p><p className="mt-1 break-all">Transaction hash: {result.txHash}</p></div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstitutionDashboard;
