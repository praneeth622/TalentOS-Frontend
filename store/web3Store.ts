"use client";
import { create } from "zustand";
import {
  connectWallet,
  getCurrentAccount,
  getShortAddress,
  isMetaMaskInstalled,
} from "@/lib/web3";

interface Web3State {
  address: string | null;
  shortAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  checkConnection: () => Promise<void>;
}

export const useWeb3Store = create<Web3State>((set) => ({
  address: null,
  shortAddress: null,
  isConnected: false,
  isConnecting: false,

  connect: async () => {
    set({ isConnecting: true });
    try {
      const address = await connectWallet();
      set({
        address,
        shortAddress: getShortAddress(address),
        isConnected: true,
        isConnecting: false,
      });
    } catch (err) {
      set({ isConnecting: false });
      throw err;
    }
  },

  disconnect: () =>
    set({
      address: null,
      shortAddress: null,
      isConnected: false,
    }),

  checkConnection: async () => {
    if (!isMetaMaskInstalled()) return;
    const account = await getCurrentAccount();
    if (account) {
      set({
        address: account,
        shortAddress: getShortAddress(account),
        isConnected: true,
      });
    }
  },
}));
