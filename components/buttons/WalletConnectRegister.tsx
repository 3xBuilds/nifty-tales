"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { IoMdWallet } from 'react-icons/io';
// import wallet from "@/assets/WebsiteLanding/logos/wallet.png"
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/context/MainContext';
import { useEffect } from 'react';
import axios from 'axios';
import Icon from '../Global/Icon';
import { useRouter } from 'next/navigation';

export const WalletConnectRegister = () => {


  return (
    <div className=''>
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div className='w-full'
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} className='bg-nifty-white hover:-translate-y-1 duration-200 w-[15.3rem] rounded-xl px-6 py-3 text-black flex flex-row items-center justify-center gap-2' > <Icon name='metamask'/> Use Metamask</button>

                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className='text-white bg-red-500 hover:bg-red-400 font-bold rounded-lg hover:-translate-y-1 px-3 h-10 transform transition duration-200 ease-in-out flex-col flex items-center justify-center gap-2'>
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  
                  <button title='Click to view address' onClick={openAccountModal} type="button" className='flex font-bold hover:-translate-y-1 duration-200 items-center gap-2 justify-center text-white bg-green-500 rounded-lg max-md:text-md w-[15.3rem] text-lg px-3 py-1 transform transition '>
                    {/* <Image src={wallet} alt="stickerGen" className='w-10'/>
                     */}
                     <IoMdWallet/>
                     Connected
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
    </div>
  );
};