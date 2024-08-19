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

const PreRegister = () => {
  const {data:session} = useSession();
  const router = useRouter()

  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [first, setFirst] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [userNameExists, setUserNameExists] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean>(false);

  // async function register(userName:string, email:string){
  //   try{
  //     await axios.post("/api/user/create", {username:userName, email:email})
  //       .then((res)=>{
  //         setFirst(true);
  //       })
  //       .catch((err)=>{
  //         console.error(err);
  //         if(err.response.status == 400){
  //           setUserExists(true);
  //         }
  //         else if(err.response.status == 408){
  //           setEmailExists(true)
  //         }
  //         else if(err.response.status == 409){
  //           setUserNameExists(true);
  //         }
  //       });
  //   }
  //   catch(err){
  //     console.error(err);
  //   }
  // }

  // useEffect(()=>{
  //   if(session){
  //     router.push("/explore")
  //   }
  // },[session?.user])

  const handleGoogleSignIn = () => {
    signIn('google')
  }


  useEffect(()=>{
    if(session){
      // console.log(session, "yay");
      router.push("/explore");
    }
  },[session])

  return (
    <div className=' flex flex-col items-center justify-center'>

      <button onClick={()=>{router.push("/")}} className='bg-nifty-white shadow-md shadow-black/20 w-10 h-10 rounded-full flex items-center justify-center absolute top-5 left-5'>
        <IoMdArrowBack/>
      </button>

        <>
          <div className='w-screen h-screen flex flex-col items-center justify-center'>
            <h1 className=' max-md:text-center max-md:text-xl text-center text-3xl font-bold'>Log In</h1>
            <div className='bg-white w-72 outline-nifty-black rounded-xl shadow-2xl shadow-black/50 p-5 flex flex-col items-center justify-center gap-4 mt-10'>
              <button onClick={handleGoogleSignIn} className='bg-nifty-white max-md:hidden hover:-translate-y-1 duration-200 w-full rounded-xl px-6 py-3 text-black flex flex-row items-center justify-center gap-2' > <Icon name='google'/> Use Google</button>
              <WalletConnectRegister/>
            </div>
          </div>
        </>
      
    </div>
  )
}

export default PreRegister