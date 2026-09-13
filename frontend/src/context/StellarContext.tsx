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
import { track } from "@/lib/analytics";
import { captureError } from "@/lib/monitoring";
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
    try {
      const connection = await isConnected();
      if (connection.error) {
        throw new Error(connection.error.message || "Freighter wallet is not available.");
      }
      if (!connection.isConnected) {
        throw new Error("Freighter wallet is not connected.");
      }

      const result = await requestAccess();
      if (result.error) {
        throw new Error(result.error.message || "Freighter wallet access was not granted.");
      }
      if ("address" in result && result.address) {
        setPublicKey(result.address);
        track("wallet_connected", { network: frontendEnv.stellarNetwork });
        return;
      }

      throw new Error("Freighter wallet access was not granted.");
    } catch (error) {
      captureError(error, { category: "wallet_error", operation: "connect" });
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setPublicKey(null);
    track("wallet_disconnected", { network: frontendEnv.stellarNetwork });
  }, []);

  const signTransaction = useCallback(
    async (xdr: string) => {
      if (!publicKey) {
        throw new Error("Connect a Freighter wallet before signing.");
      }
      try {
        const result = await freighterSignTransaction(xdr, {
          address: publicKey,
          networkPassphrase: frontendEnv.stellarNetworkPassphrase,
        });
        if (result.error || !result.signedTxXdr) {
          throw new Error(result.error?.message || "Freighter did not sign the transaction.");
        }
        return result.signedTxXdr;
      } catch (error) {
        captureError(error, { category: "wallet_error", operation: "sign_transaction" });
        throw error;
      }
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
