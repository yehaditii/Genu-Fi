import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { isConnected, requestAccess, signTransaction as freighterSignTransaction } from "@stellar/freighter-api";
import { frontendEnv } from "@/config/env";
import type { WalletState } from "@/types/stellar";

interface StellarContextValue extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const StellarContext = createContext<StellarContextValue | undefined>(undefined);

export function StellarProvider({ children }: PropsWithChildren) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const network = frontendEnv.stellarNetwork;

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

  const signTransaction = useCallback(
    async (xdr: string) => {
      if (!publicKey) {
        throw new Error("Connect a Freighter wallet before signing.");
      }
      const result = await freighterSignTransaction(xdr, {
        address: publicKey,
        networkPassphrase: frontendEnv.stellarNetworkPassphrase,
      });
      if (result.error || !result.signedTxXdr) {
        throw new Error(result.error?.message || "Freighter did not sign the transaction.");
      }
      return result.signedTxXdr;
    },
    [publicKey]
  );

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
