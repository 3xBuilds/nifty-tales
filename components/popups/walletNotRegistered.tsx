"use client"

import { useGlobalContext } from '@/context/MainContext'
import React from 'react'

export const WalletNotRegistered = () => {

    const {user} = useGlobalContext();

  return (
    <div className='w-screen h-screen backdrop-blur-2xl fixed bg-black/50 text-white top-0 left-0 z-50 flex flex-col items-center justify-center '>
        <h2 className='text-xl font-bold'>You are connected with an unregistered wallet!</h2>
        <h3 className='text-lg font-semibold mt-10' >Connect {user?.wallet} to continue.</h3>
    </div>
  )
}
