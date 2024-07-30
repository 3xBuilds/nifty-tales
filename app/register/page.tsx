"use client"
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios';

const PreRegister = () => {
  const {data:session} = useSession();

    const[userName, setUserName] = useState<string>("");
    const[email, setEmail] = useState<string>("")


    async function register(userName:string, email:string){
        try{
            await axios.post("/api/user/create", {username:userName, email:email})
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


  return (
    <div className='pt-16'>
      <h1 className=' max-md:text-center max-md:text-2xl text-center text-4xl font-bold mt-10'>Pre-Register</h1>

        
    </div>
  )
}

export default PreRegister