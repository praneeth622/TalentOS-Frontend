"use client";
import { useEffect, useRef, useState } from "react";
import { useWeb3Store } from "@/store/web3Store";
import { isMetaMaskInstalled } from "@/lib/web3";
import { toast } from "sonner";
import {
  Wallet,
  ChevronDown,
  ExternalLink,
  Copy,
  LogOut,
} from "lucide-react";

export function WalletButton() {
  const {
    address,
    shortAddress,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    checkConnection,
  } = useWeb3Store();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Listen for MetaMask account changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    const handler = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnect();
        toast.info("Wallet disconnected");
      } else {
        checkConnection();
      }
    };
    window.ethereum.on("accountsChanged", handler);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handler);
    };
  }, [disconnect, checkConnection]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error("MetaMask not found", {
        description: "Install MetaMask browser extension to connect",
        action: {
          label: "Install",
          onClick: () => window.open("https://metamask.io", "_blank"),
        },
      });
      return;
    }
    try {
      await connect();
      toast.success("Wallet connected!");
    } catch (err: unknown) {
      const error = err as { code?: number; message?: string };
      if (error.code === 4001 || error.message?.includes("rejected")) {
        toast.error("Connection rejected by user");
      } else if (error.message === "METAMASK_NOT_INSTALLED") {
        toast.error("Please install MetaMask");
      } else {
        toast.error("Failed to connect wallet");
      }
    }
  };

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
    setOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setOpen(false);
    toast.success("Wallet disconnected");
  };

  // NOT CONNECTED STATE
  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold
                   border border-slate-200 rounded-xl
                   hover:border-indigo-400 hover:text-indigo-600
                   bg-white text-slate-600
                   transition-all duration-200 disabled:opacity-50"
      >
        {isConnecting ? (
          <div
            className="w-4 h-4 border-2 border-indigo-500
                        border-t-transparent rounded-full animate-spin"
          />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
      </button>
    );
  }

  // CONNECTED STATE
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold
                   border border-green-200 bg-green-50
                   text-green-700 rounded-xl
                   hover:border-green-400 transition-all duration-200"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-mono">{shortAddress}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52
                      bg-white border border-slate-200
                      rounded-xl shadow-lg z-50 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[10px] text-slate-400">Connected wallet</p>
            <p className="text-xs font-mono font-medium mt-0.5 truncate text-slate-700">
              {address}
            </p>
          </div>

          <div className="p-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full px-3 py-2
                         text-sm rounded-lg text-left text-slate-600
                         hover:bg-slate-50 transition-colors"
            >
              <Copy className="w-4 h-4 text-slate-400" />
              Copy Address
            </button>

            <button
              onClick={() => {
                window.open(
                  `https://amoy.polygonscan.com/address/${address}`,
                  "_blank"
                );
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2
                         text-sm rounded-lg text-left text-slate-600
                         hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              View on Polygonscan
            </button>

            <div className="h-px bg-slate-100 my-1" />

            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 w-full px-3 py-2
                         text-sm rounded-lg text-left
                         hover:bg-red-50 text-red-600
                         transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
