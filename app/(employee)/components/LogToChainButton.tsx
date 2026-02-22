"use client";

import { useState } from "react";
import { Link } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  isMetaMaskInstalled,
  connectWallet,
  signTaskCompletion,
} from "@/lib/web3";

interface LogToChainButtonProps {
  taskId: string;
  taskTitle: string;
  onSuccess: () => void;
}

/**
 * Web3 button that signs a completed task via MetaMask and stores
 * the resulting signature hash on the backend as proof of completion.
 * Only renders for COMPLETED tasks that have no txHash yet.
 */
export function LogToChainButton({
  taskId,
  taskTitle,
  onSuccess,
}: LogToChainButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // 1. Check MetaMask
      if (!isMetaMaskInstalled()) {
        toast.error(
          "MetaMask not installed. Install it to use this feature."
        );
        return;
      }

      // 2. Connect wallet
      let address: string;
      try {
        address = await connectWallet();
      } catch {
        toast.error("Wallet connection cancelled");
        return;
      }

      // 3. Sign task completion
      let txHash: string;
      try {
        txHash = await signTaskCompletion(taskId, taskTitle, address);
      } catch {
        toast.error("Signing cancelled");
        return;
      }

      // 4. Persist txHash to backend
      try {
        await api.patch(`/api/tasks/${taskId}/txhash`, { txHash });
      } catch {
        toast.error("Failed to save verification");
        return;
      }

      // 5. Success
      toast.success("Task verified on-chain ✓");
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
        bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold
        transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <Link size={13} strokeWidth={2.2} />
      )}
      {loading ? "Signing…" : "Log to Chain"}
    </button>
  );
}
