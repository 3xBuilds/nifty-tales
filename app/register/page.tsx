"use client"
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { IoBackspaceSharp } from 'react-icons/io5';

const PreRegister = () => {
  const {data:session} = useSession();

    const[userName, setUserName] = useState<string>("");
    const[email, setEmail] = useState<string>("");
    const[first, setFirst] = useState<boolean>(false);
    const[emailExists, setEmailExists] = useState<boolean>(false);
    const[userNameExists, setUserNameExists] = useState<boolean>(false);
    const[userExists, setUserExists] = useState<boolean>(false);

    async function register(userName:string, email:string){
        try{
            console.log(email, userName);
            await axios.post("/api/user/create", {username:userName, email:email}).then((res)=>{console.log(res);setFirst(true)}).catch((err)=>{
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

            register(session?.user?.name || "", session?.user?.email||"");
        }
    },[session?.user])

    const router = useRouter()


  return (
    <div className='pt-16 flex flex-col items-center justify-center'>
      <button onClick={()=>{router.push("/")}} className='bg-gray-400 w-10 h-10 rounded-full'>
        <IoBackspaceSharp className='w-10'/>
      </button>

      {first && <div className=''>
            <h3 className='text-center font-bold text-black mt-5 md:text-4xl text-2xl'>Thank you for registering!</h3>
            <h4 className='text-center text-gray-500 mt-3 text-md'>Stay tuned for updates!</h4>
            </div>}

      {(session?.user || userExists) && !first ? <div className='mt-40'>
            <button onClick={()=>{ if(session){signOut();} else{setUserExists(false)}; router.push("/")}}  className=" md:w-[8rem] w-[7rem] text-nowrap absolute top-20 right-5 rounded-full bg-red-500"><h3 >Sign Out</h3> </button>

                <h3 className='text-center font-bold text-black mt-5 md:text-4xl text-2xl'>Seems like we already know you!</h3>
                <h4 className='text-center text-gray-500 mt-3 text-md'>Stay tuned for updates!</h4>
            </div>
            :
            <>
                {!first && <div>
        <h1 className=' max-md:text-center max-md:text-2xl text-center text-4xl font-bold mt-10'>Pre-Register</h1>
          <div className='bg-gray-400 p-10 flex flex-col items-center justify-center gap-4'>
          <div className={` w-full `}>
              <h3 className={`text-xs font-semibold pb-2 duration-200 `}>Username</h3>
              <input name='Username' value={userName} onChange={(e)=>{setUserName(e.target.value)}} className={`${userNameExists ? "border-red-500 border-[1px]" : "border-2 border-gray-500 "}  p-2`} ></input>
          </div>
          <div className={` w-full `}>
              <h3 className={`text-xs font-semibold pb-2 duration-200 `}>Email</h3>
              <input type='email' name='Username' value={email} onChange={(e)=>{setEmail(e.target.value)}} className={`${emailExists ? "border-red-500 border-[1px]" : "border-2 border-gray-500 "}  p-2`} ></input>
          </div>

          <button onClick={()=>{register(userName, email)}} className='bg-black rounded-xl px-6 py-3 text-white' >Pre-Register</button>

          <button onClick={()=>{signIn()}} className='bg-blue-500 rounded-xl px-6 py-3 text-black' >Google</button>
          </div>
      </div>}
            </>
            }
      
        
    </div>
  )
}

export default PreRegister