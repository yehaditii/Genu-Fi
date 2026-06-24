import { useStellar } from "@/context/StellarContext";

const WalletConnector = () => {
  const { publicKey, isConnected, connectWallet, disconnectWallet } = useStellar();

  return isConnected ? (
    <div className="flex items-center gap-3">
      <span className="rounded-full border border-aqua-neon/40 px-3 py-2 text-sm text-soft-neon">
        {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
      </span>
      <button className="btn-secondary" onClick={disconnectWallet}>
        Disconnect
      </button>
    </div>
  ) : (
    <button className="btn-primary" onClick={() => void connectWallet()}>
      Connect Freighter
    </button>
  );
};

export default WalletConnector;
