"use client";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';

const getSiweMessageOptions:GetSiweMessageOptions = () => ({
  statement: 'Sign in to Nifty Tales',
});


// const WalletIdContext = createContext<any>(null);

// const { chains, publicClient } = configureChains(
//   [base],
//   [publicProvider()]
// );

// const { wallets } = getDefaultWallets({
//   appName: "My RainbowKit App",
//   projectId: "5d10af3027c340310f3a3da64cbcedac",
//   chains,
// });


// const connectors = connectorsForWallets(
//   [
//     ...wallets,
//     {
//       groupName: 'Phantom',
//       wallets: [phantomWallet({ chains })],
//     }],

//   // { appName: 'RainbowKit App', projectId: '5d10af3027c340310f3a3da64cbcedac' }
// );

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors,
//   publicClient,
// });

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '5d10af3027c340310f3a3da64cbcedac',
  chains: [base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient()



const Rainbow = ({ children }: any) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
      <RainbowKitProvider coolMode >
        {children}
      </RainbowKitProvider>
      </RainbowKitSiweNextAuthProvider>
      </QueryClientProvider>
      </WagmiProvider>
  );
};

// export const useWalletId = () => useContext(WalletIdContext);

export default Rainbow;
