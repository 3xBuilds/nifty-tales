'use client';

import React from 'react'

//Context
import { GlobalContextProvider } from '../../context/MainContext';

//Web3
import RainbowProvider from '../rainbow/rainbowKit';
import { SessionProvider } from 'next-auth/react';

const Providers = ({ children }) => {

  return (
    <SessionProvider>
    <RainbowProvider>
      <GlobalContextProvider>
          {children}
      </GlobalContextProvider>
    </RainbowProvider>
    </SessionProvider>
  )
}

export default Providers