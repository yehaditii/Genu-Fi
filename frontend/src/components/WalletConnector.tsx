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
    <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:items-center gap-2 sm:gap-3">
      <span
        className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-soft-neon"
        title={publicKey || undefined}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
        <span className="font-mono">
          {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
        </span>
      </span>
      <button
        className="btn-secondary min-h-10 px-3 py-1.5 text-xs sm:text-sm w-full sm:w-auto"
        onClick={disconnectWallet}
        aria-label="Disconnect Stellar wallet"
      >
        Disconnect
      </button>
    </div>
  ) : (
    <div className="w-full sm:w-auto">
      <button
        className="btn-primary min-h-10 px-4 py-2 text-xs sm:text-sm w-full sm:w-auto"
        onClick={() => void handleConnect()}
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : "Connect Freighter"}
      </button>
      {error && <p className="mt-2 max-w-xs break-words text-xs text-red-300">{error}</p>}
    </div>
  );
};

export default WalletConnector;
