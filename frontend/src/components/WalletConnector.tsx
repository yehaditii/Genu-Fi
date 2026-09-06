import { useStellar } from "@/context/StellarContext";
import { useState } from "react";

const WalletConnector = () => {
  const { publicKey, isConnected, connectWallet, disconnectWallet } = useStellar();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      await connectWallet();
    } catch (connectionError) {
      setError(connectionError instanceof Error ? connectionError.message : "Wallet connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  return isConnected ? (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 px-3 py-2 text-sm text-soft-neon" title={publicKey || undefined}>
        <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
        <span>Connected: {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}</span>
      </span>
      <button className="btn-secondary" onClick={disconnectWallet} aria-label="Disconnect Stellar wallet">
        Disconnect
      </button>
    </div>
  ) : (
    <div>
      <button className="btn-primary" onClick={() => void handleConnect()} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect Freighter"}
      </button>
      {error && <p className="mt-2 max-w-xs text-xs text-red-300">{error}</p>}
    </div>
  );
};

export default WalletConnector;
