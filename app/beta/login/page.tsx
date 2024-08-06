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
      console.log(session);
      const name = localStorage.getItem("userName");
      if(name == ""){
        register(session?.user?.name || "", session?.user?.email||"");
      }
      else{
        register(name || "", session?.user?.email||"");
      }
      localStorage.clear();
      router.push("/explore");
    }
  },[session?.user])

  // useEffect(()=>{
  //   if(session){
  //     const router = useRouter();
  //     router.push('/explore')
  //   }
  // },[])

  const handleGoogleSignIn = () => {
    signIn('google');
  }

  const registerWithGoogle = () =>{
    signIn('google');
    localStorage.setItem("userName", userName)
    }
  
  

  return (
    <div className=' flex flex-col items-center justify-center'>
      <button onClick={()=>{router.push("/")}} className='bg-nifty-white shadow-md shadow-black/20 w-10 h-10 rounded-full absolute top-5 left-5'>
        <IoBackspaceSharp className='w-10'/>
      </button>

      
        <>
          <div className='w-screen h-screen flex flex-col items-center justify-center'>
            <h1 className=' max-md:text-center max-md:text-xl text-center text-3xl font-bold'>{type}</h1>
            <div className='bg-white w-72 outline-nifty-black rounded-xl shadow-2xl shadow-black/50 p-5 flex flex-col items-center justify-start gap-4 mt-10'>
                <OptionToggle options={['Login', 'Register']} selectedOption={type} setOption={setType} />

              {type == "Register" && <div className={` w-full `}>
                <h3 className={`text-xs font-semibold pb-2 duration-200 to-nifty-black `}>Username (optional)</h3>
                <input placeholder='needle03' name='Username' value={userName} onChange={(e)=>{setUserName(e.target.value)}} className={` w-full ${userNameExists ? "border-red-500 border-[1px]" : "border-[1px] border-nifty-gray-1 "} rounded outline-nifty-black  p-2`} ></input>
              </div>}
              {/* <div className={` w-full `}>
                <h3 className={`text-xs font-semibold pb-2 duration-200 to-nifty-black `}>Email</h3>
                <input type='email' name='Username' value={email} onChange={(e)=>{setEmail(e.target.value)}} className={` w-full ${emailExists ? "border-red-500 border-[1px]" : "border-[1px] border-nifty-gray-1 "} rounded  outline-nifty-black p-2`} ></input>
              </div> */}

              {/* <button onClick={()=>{register(userName, email)}} className='bg-black w-full rounded-xl px-6 py-3 text-white' >Pre-Register</button> */}
                <div className='h-full flex items-center mt-4'>
                {type == "Login" ? <button onClick={handleGoogleSignIn} className='bg-nifty-white w-full rounded-xl px-6 py-3 text-black flex flex-row items-center justify-center gap-2' > <Icon name='google'/>Login with Google</button> : <button onClick={()=>{registerWithGoogle()}} className='bg-nifty-white w-full rounded-xl px-6 py-3 text-black flex flex-row items-center justify-center gap-2' > <Icon name='google'/>Register with Google</button>}

                </div>
            </div>
          </div>
        </>
      
    </div>
  )
}

export default PreRegister