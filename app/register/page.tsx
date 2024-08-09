"use client"
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { IoBackspaceSharp } from 'react-icons/io5';
import Icon from '@/components/Global/Icon';

const PreRegister = () => {
  const {data:session} = useSession();
  console.log("seshhhh: ", session);
  const router = useRouter()

  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [first, setFirst] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [userNameExists, setUserNameExists] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean>(false);

  async function register(userName:string, email:string){
    try{
      console.log(email, userName);
      await axios.post("/api/user/create", {username:userName, email:email})
        .then((res)=>{
          console.log(res);
          setFirst(true);
        })
        .catch((err)=>{
          console.log(err);
          if(err.response.status == 400){
            setUserExists(true);
          }
          else if(err.response.status == 408){
            setEmailExists(true)
          }
          else if(err.response.status == 409){
            setUserNameExists(true);
          }
        });
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    if(session){
      console.log(session)
      setUserName(session?.user?.name || "");
      setEmail(session?.user?.email || "");

      // register(session?.user?.name || "", session?.user?.email||"");
    }
  },[session?.user])

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/register' })
  }

  return (
    <div className=' flex flex-col items-center justify-center'>
      <button onClick={()=>{router.push("/")}} className='bg-nifty-white shadow-md shadow-black/20 w-10 h-10 rounded-full absolute top-5 left-5'>
        <IoBackspaceSharp className='w-10'/>
      </button>

      {first && <div className=''>
        <h3 className='text-center font-bold text-black mt-5 md:text-4xl text-2xl'>Thank you for registering!</h3>
        <h4 className='text-center text-gray-500 mt-3 text-md'>Stay tuned for updates!</h4>
      </div>}

      {(session?.user || userExists) && !first ? 
        <div className='w-screen h-screen flex flex-col items-center justify-center'>
          <h3 className='text-center font-bold text-black mt-5 md:text-4xl text-2xl'>Seems like we already know you!</h3>
          <h4 className='text-center text-gray-500 mt-3 text-md'>Stay tuned for updates!</h4>
          <div className='flex flex-row gap-2'>
            <button onClick={()=>{ if(session){signOut();} else{setUserExists(false)};
             router.push("/")}}  className='bg-nifty-white shadow-md hover:shadow-lg hover:shadow-black/10 duration-200 w-fit rounded-xl px-6 py-2 mt-5 text-black flex flex-row items-center justify-center gap-2'>Sign Out </button>
            <button onClick={()=>{ router.push("/")}}  className='bg-nifty-black shadow-md hover:shadow-lg hover:shadow-black/10 duration-200 w-fit rounded-xl px-6 py-2 mt-5 text-white flex flex-row items-center justify-center gap-2'> Go Home </button>
          </div>
        </div>
        :
        <>
          {!first && <div className='w-screen h-screen flex flex-col items-center justify-center'>
            <h1 className=' max-md:text-center max-md:text-xl text-center text-3xl font-bold'>Pre-Register</h1>
            <div className='bg-white w-72 outline-nifty-black rounded-xl shadow-2xl shadow-black/50 p-5 flex flex-col items-center justify-center gap-4 mt-10'>
              <div className={` w-full `}>
                <h3 className={`text-xs font-semibold pb-2 duration-200 to-nifty-black `}>Username</h3>
                <input name='Username' value={userName} onChange={(e)=>{setUserName(e.target.value)}} className={` w-full ${userNameExists ? "border-red-500 border-[1px]" : "border-[1px] border-nifty-gray-1 "} rounded outline-nifty-black  p-2`} ></input>
              </div>
              <div className={` w-full `}>
                <h3 className={`text-xs font-semibold pb-2 duration-200 to-nifty-black `}>Email</h3>
                <input type='email' name='Username' value={email} onChange={(e)=>{setEmail(e.target.value)}} className={` w-full ${emailExists ? "border-red-500 border-[1px]" : "border-[1px] border-nifty-gray-1 "} rounded  outline-nifty-black p-2`} ></input>
              </div>

              <button onClick={()=>{register(userName, email)}} className='bg-black w-full rounded-xl px-6 py-3 text-white' >Pre-Register</button>

              <button onClick={handleGoogleSignIn} className='bg-nifty-white w-full rounded-xl px-6 py-3 text-black flex flex-row items-center justify-center gap-2' > <Icon name='google'/> Sign in with Google</button>
            </div>
          </div>}
        </>
      }
    </div>
  )
}

export default PreRegister