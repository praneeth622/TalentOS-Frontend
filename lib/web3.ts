// Extend Window type for ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === "undefined") return false;
  return Boolean(window.ethereum?.isMetaMask);
};

export const getShortAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const connectWallet = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("METAMASK_NOT_INSTALLED");
  }
  const accounts = (await window.ethereum!.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error("NO_ACCOUNTS");
  }
  return accounts[0];
};

export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null;
  try {
    const accounts = (await window.ethereum!.request({
      method: "eth_accounts",
    })) as string[];
    return accounts.length > 0 ? accounts[0] : null;
  } catch {
    return null;
  }
};

export const signTaskCompletion = async (
  taskId: string,
  taskTitle: string,
  address: string
): Promise<string> => {
  if (!isMetaMaskInstalled()) throw new Error("METAMASK_NOT_INSTALLED");

  const message =
    `TalentOS Task Verification\n` +
    `Task: ${taskTitle}\n` +
    `ID: ${taskId}\n` +
    `Verified by: ${address}\n` +
    `Time: ${new Date().toISOString()}`;

  const signature = (await window.ethereum!.request({
    method: "personal_sign",
    params: [message, address],
  })) as string;

  return signature;
};

export const addPolygonAmoyNetwork = async (): Promise<void> => {
  await window.ethereum!.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x13882",
        chainName: "Polygon Amoy Testnet",
        nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
        rpcUrls: ["https://rpc-amoy.polygon.technology/"],
        blockExplorerUrls: ["https://amoy.polygonscan.com/"],
      },
    ],
  });
};
