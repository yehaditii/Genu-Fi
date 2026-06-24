import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { isConnected, requestAccess } from "@stellar/freighter-api";
import type { WalletState } from "@/types/stellar";

interface StellarContextValue extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const StellarContext = createContext<StellarContextValue | undefined>(undefined);

export function StellarProvider({ children }: PropsWithChildren) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const network = import.meta.env.VITE_STELLAR_NETWORK ?? "TESTNET";

  const connectWallet = useCallback(async () => {
    const connection = await isConnected();
    if (connection.isConnected && connection.publicKey) {
      setPublicKey(connection.publicKey);
      return;
    }

    const result = await requestAccess();
    if ("address" in result && result.address) {
      setPublicKey(result.address);
      return;
    }

    throw new Error("Freighter wallet access was not granted.");
  }, []);

  const disconnectWallet = useCallback(() => {
    setPublicKey(null);
  }, []);

  const signTransaction = useCallback(async (xdr: string) => xdr, []);

  const value = useMemo<StellarContextValue>(
    () => ({
      publicKey,
      isConnected: Boolean(publicKey),
      network,
      connectWallet,
      disconnectWallet,
      signTransaction,
    }),
    [connectWallet, disconnectWallet, network, publicKey, signTransaction]
  );

  return <StellarContext.Provider value={value}>{children}</StellarContext.Provider>;
}

export function useStellar() {
  const context = useContext(StellarContext);
  if (!context) {
    throw new Error("useStellar must be used within StellarProvider");
  }

  return context;
}
