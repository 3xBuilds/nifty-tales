"use client";
import '@rainbow-me/rainbowkit/styles.css';
import {
  AvatarComponent,
} from '@rainbow-me/rainbowkit';

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
import { useGlobalContext } from '@/context/MainContext';

const getSiweMessageOptions:GetSiweMessageOptions = () => ({
  statement: 'Sign in to Nifty Tales',
});

// const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {

//   const {setEnsImg} = useGlobalContext();
//   // const color = generateColorFromAddress(address);
//   if(ensImage){
//     console.log("THIS IS ENS IMAGE", ensImage)
//     setEnsImg(ensImage)
//   }
//   return ensImage ? (
//     <img
//       src={ensImage}
//       width={size}
//       height={size}
//       style={{ borderRadius: 999 }}
//     />
//   ) : (
//     <div
//       style={{
//         backgroundColor: `#284`,
//         borderRadius: 999,
//         height: size,
//         width: size,
//       }}
//     >
//       :^)
//     </div>
//   );
// };

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
