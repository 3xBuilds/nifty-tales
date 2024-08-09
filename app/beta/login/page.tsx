"use client"
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { IoBackspaceSharp } from 'react-icons/io5';
import Icon from '@/components/Global/Icon';
import OptionToggle from '@/components/Global/OptionToggle';

const PreRegister = () => {
  const {data:session} = useSession();
  const router = useRouter()

  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [first, setFirst] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [userNameExists, setUserNameExists] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean>(false);

  const[type, setType] = useState("Register")

  const handleGoogleSignIn = () => {
    signIn('google',
    {
      callbackUrl: '/explore'
    }
    );
  }
  

  return (
    <div className=' flex flex-col items-center justify-center'>
      <button onClick={()=>{router.push("/")}} className='bg-nifty-white shadow-md shadow-black/20 w-10 h-10 rounded-full absolute top-5 left-5'>
        <IoBackspaceSharp className='w-10'/>
      </button>
        <>
          <div className='w-screen h-screen flex flex-col items-center justify-center'>
            <h1 className=' max-md:text-center max-md:text-xl text-center text-3xl font-bold'>{type}</h1>
            <div className='bg-white outline-nifty-black rounded-xl shadow-2xl shadow-black/50 p-5 flex flex-col items-center justify-start gap-4 mt-10'>
                <div className='h-full flex items-center justify-center'>
                <button onClick={handleGoogleSignIn} className='bg-nifty-white w-full rounded-lg px-6 py-3 text-black flex flex-row items-center justify-center gap-2' > <Icon name='google'/>Signin with Google</button>
                </div>
            </div>
          </div>
        </>
      
    </div>
  )
}

export default PreRegister