"use client"
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { IoBackspaceSharp } from 'react-icons/io5';
import Icon from '@/components/Global/Icon';
import { WalletNotRegistered } from '@/components/popups/walletNotRegistered';
import { IoMdArrowBack } from 'react-icons/io';
import { WalletConnectRegister } from '@/components/buttons/WalletConnectRegister';
import { useLoading } from '@/components/PageLoader/LoadingContext';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';


const PreRegister = () => {
  const {data:session} = useSession();
  const router = useRouter()
  const {address} = useAccount()

  const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])

  const handleGoogleSignIn = () => {
    signIn('google')
  }


  useEffect(()=>{
    if(session){
      setIsLoading(true);
      router.push("/explore");
    }
  },[session])


  useEffect(()=>{
    console.log("THIS IS ADDRESS", address)
  },[address])

  async function tokenChecker() {
    try {
      const res = await axios.get("/api/tokenChecker");
      console.log(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log(error, "WTF BRO")
        router.push('/connect');
      } else {
        console.error("An error occurred:", error);
      }
    }
  }
  
  useEffect(() => {
    tokenChecker();
  }, []);
  

  return (
    <div className='w-screen h-screen fixed top-0 flex flex-col items-center justify-center overflow-y-hidden object-contain -my-10 '>

      <button onClick={()=>{setIsLoading(true);router.push("/")}} className='bg-nifty-white shadow-md shadow-black/20 w-10 h-10 rounded-full flex items-center justify-center absolute z-[100] top-16 left-5'>
        <IoMdArrowBack/>
      </button>

      <div className='flex flex-col items-center justify-center'>
            <h1 className=' max-md:text-center max-md:text-xl text-center text-3xl font-bold'>Log In</h1>
            <div className='bg-white w-72 outline-nifty-black rounded-xl shadow-2xl shadow-black/50 p-5 flex flex-col items-center justify-center gap-4 mt-10'>
              <button onClick={handleGoogleSignIn} className='bg-nifty-white hover:-translate-y-1 duration-200 w-full rounded-xl px-6 py-3 text-black flex flex-row items-center justify-center gap-2' > <Icon name='google'/> Use Google</button>
              <WalletConnectRegister/>
            </div>
          </div>
      
    </div>
  )
}

export default PreRegister