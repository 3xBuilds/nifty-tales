"use client"
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios';
import { useRouter } from 'next/navigation'

import { IoMdArrowBack } from 'react-icons/io';
import { WalletConnectRegister } from '@/components/buttons/WalletConnectRegister';
import { useLoading } from '@/components/PageLoader/LoadingContext';
import { useAccount } from 'wagmi';

import { CgProfile } from "react-icons/cg";
import { useGlobalContext } from '@/context/MainContext';


const PreRegister = () => {
  const {data:session} = useSession();
  const router = useRouter()
  const {address} = useAccount()
  const {night} = useGlobalContext()
  const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])

  const handleGuestSignIn = () =>{
    signIn('anonymous', { callbackUrl: '/explore' });
  }

  useEffect(()=>{
    if(session){
      setIsLoading(true);
      router.push("/explore");
    }
  },[session])

  async function tokenChecker() {
    try {
      const res = await axios.get("/api/tokenChecker");
      // console.log(res.data);
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
    <div className={`${night ? "bg-[#212121]" : "bg-white"} h-screen w-screen overflow-y-hidden -my-16`}>
      <div className={`w-screen h-screen fixed top-0 flex flex-col items-center justify-center overflow-y-hidden object-contain -my-10 `}>

        <button onClick={()=>{setIsLoading(true);router.push("/")}} className='bg-gray-300/20 shadow-md shadow-black/20 w-10 h-10 rounded-full flex items-center justify-center absolute z-[100] top-16 left-5'>
          <IoMdArrowBack className={`${night ? "text-white" : "text-black"} duration-200`}/>
        </button>

        <div className='flex flex-col items-center justify-center'>
              <h2 className={`max-md:text-center max-md:text-xl ${night ? "text-white" : "text-black"} duration-200 text-center text-3xl font-bold`}>Connect</h2>
              <div className={`${night ? "bg-[#313131]" : 'bg-white'} w-72  rounded-xl shadow-2xl shadow-black/50 p-5 flex flex-col items-center justify-center gap-4 mt-5`}>
                <WalletConnectRegister/>
                <button onClick={handleGuestSignIn} className={`bg-nifty-white/20 hover:-translate-y-1 duration-200 w-full rounded-xl px-6 py-3 ${night ? "text-white" : "text-black"} duration-200 flex flex-row items-center justify-center gap-2`}><CgProfile/> Guest Login</button>
              </div>
            </div>
        
      </div>
    </div>
  )
}

export default PreRegister