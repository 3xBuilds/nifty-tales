"use client"

import { useGlobalContext } from '@/context/MainContext'
import axios from 'axios';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { useAccount, useEnsName } from 'wagmi'
import { getEnsName } from '@wagmi/core'
import { config } from './config'
import { toast } from 'react-toastify';


export const AddEmail = () => {
    const {user, getUser} = useGlobalContext();
    const [newEmail, setNewEmail] = useState<string>();

    const [ens, setEns] = useState<string>("");

    const {address} = useAccount()

    getEnsName(config, { address: address as `0x${string}`}).then((ensName) => {
        // console.log("ENS NAMEEEE", ensName)
        setEns(ensName as string);
    })
    .catch((error) => {
      console.error(`Error getting ENS name: ${error}`);
    });

    async function handleEmailSetup(){
        try{
            await axios.get("/api/user/"+newEmail);
            toast.info("Another account with same email exists.");
            toast.info("Delete the one with the same email if you want to proceed with this account.")   
        }
        catch(err){
            console.log(err);

            if(!ens){
                console.log("Sexy af", user?.email);

                await axios.patch("/api/user/"+user?.email, {email: newEmail}).then((res)=>{
                    signOut()

                })
            }
            else{
                console.log(user?.email);
                await axios.patch("/api/user/"+user?.email, {email: newEmail, username: ens}).then((res)=>{
                    signOut()
                })
            }
        }
    }

  return (
    <div className="w-screen h-screen z-[10000000000000] fixed top-0 left-0 backdrop-blur-xl flex flex-col items-center justify-center" >
        <div className='w-80 bg-white shadow-xl shadow-black/30 rounded-lg p-5'>
            <h2 className='text-2xl font-bold' >First Time Setup</h2>
            <h2 className='text-lg font-semibold text-gray-400'>Welcome to Nifty Tales!</h2>
            <h2 className='text-sm text-gray-400 mt-5'> Kindly register your <b>Gmail</b> which will be used to link accounts when <b>logging in across different platforms.</b></h2>
            <input placeholder="Enter Email..." onChange={(e) => { setNewEmail(e.target.value); }} value={newEmail} className={`p-2 placeholder:text-gray-300 my-2 w-full peer focus:outline-none  focus:border-black focus:border-2 rounded-xl border-[1px] duration-200 `}></input>


            <h2 className='text-xs text-black my-2'><span className='text-red-500'>* </span>You will be logged out on completion of this step.</h2>

            <button onClick={handleEmailSetup} className='w-full bg-black rounded-lg h-10 text-white font-bold mt-3 hover:-transalate-y-1 duration-200' >Save</button>
            </div>

    </div>
        
  )
}
