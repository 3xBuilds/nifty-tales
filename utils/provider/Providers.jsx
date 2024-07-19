'use client';

import React from 'react'

//Context
import { GlobalContextProvider } from '../../context/MainContext';

//Web3
import RainbowProvider from '../rainbow/rainbowKit';

const Providers = ({ children }) => {

  return (
    <RainbowProvider>
      <GlobalContextProvider>
          {children}
      </GlobalContextProvider>
    </RainbowProvider>
  )
}

export default Providers