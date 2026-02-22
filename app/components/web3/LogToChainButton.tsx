"use client";
import { useState } from "react";
import { useWeb3Store } from "@/store/web3Store";
import {
  connectWallet,
  signTaskCompletion,
  isMetaMaskInstalled,
  getShortAddress,
} from "@/lib/web3";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Copy, BadgeCheck } from "lucide-react";

interface Props {
  taskId: string;
  taskTitle: string;
  txHash?: string | null;
  onVerified: () => void;
}

export function LogToChainButton({
  taskId,
  taskTitle,
  txHash,
  onVerified,
}: Props) {
  const { address, isConnected } = useWeb3Store();
  const [loading, setLoading] = useState(false);

  const handleLog = async () => {
    setLoading(true);
    try {
      // Check MetaMask
      if (!isMetaMaskInstalled()) {
        toast.error("MetaMask required", {
          description: "Install MetaMask to verify tasks on-chain",
          action: {
            label: "Install",
            onClick: () => window.open("https://metamask.io", "_blank"),
          },
        });
        return;
      }

      // Connect wallet if not connected
      let walletAddress = address;
      if (!isConnected || !walletAddress) {
        toast.info("Connecting wallet first...");
        walletAddress = await connectWallet();
      }

      // Sign the message
      toast.info("Sign the message in MetaMask...");
      const signature = await signTaskCompletion(
        taskId,
        taskTitle,
        walletAddress
      );

      // Save to backend
      await api.patch(`/api/tasks/${taskId}/txhash`, {
        txHash: signature,
      });

      toast.success("Task verified with wallet signature!", {
        description: `Sig: ${getShortAddress(signature)}`,
      });

      onVerified();
    } catch (err: unknown) {
      const error = err as { code?: number; message?: string };
      if (error.code === 4001 || error.message?.includes("rejected")) {
        toast.error("Signing cancelled");
      } else if (error.message === "METAMASK_NOT_INSTALLED") {
        toast.error("Please install MetaMask");
      } else {
        toast.error("Verification failed", {
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Already verified — signature is not an on-chain tx, so show copy action
  if (txHash) {
    const handleCopySig = () => {
      navigator.clipboard.writeText(txHash);
      toast.success("Signature copied to clipboard");
    };

    return (
      <button
        onClick={handleCopySig}
        title={`Signature: ${txHash}`}
        className="flex items-center justify-center gap-1.5 w-full
                   mt-2 px-3 py-1.5 text-xs font-semibold rounded-lg
                   bg-green-50 text-green-700
                   border border-green-200
                   hover:bg-green-100 transition-all duration-200"
      >
        <BadgeCheck className="w-3.5 h-3.5" />
        <span>Verified &middot; {txHash.slice(0, 8)}...{txHash.slice(-6)}</span>
        <Copy className="w-3 h-3 text-green-500" />
      </button>
    );
  }

  // Not verified yet
  return (
    <button
      onClick={handleLog}
      disabled={loading}
      className="flex items-center justify-center gap-1.5 w-full
                 mt-2 px-3 py-1.5 text-xs font-medium rounded-lg
                 border border-indigo-200
                 text-indigo-600
                 hover:bg-indigo-50
                 transition-all duration-200 disabled:opacity-50"
    >
      {loading ? (
        <>
          <div
            className="w-3 h-3 border border-indigo-500
                        border-t-transparent rounded-full animate-spin"
          />
          <span>Signing...</span>
        </>
      ) : (
        <>
          <span>&#9939;</span>
          <span>Log to Chain</span>
        </>
      )}
    </button>
  );
}
