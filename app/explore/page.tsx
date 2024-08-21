"use client"

import Highlights from '@/components/Explore/Highlights'
import PublicLibrary from '@/components/Explore/PublicLibrary'
import Navbar from '@/components/Home/Navbar'
import { useLoading } from '@/components/PageLoader/LoadingContext'
import { AddWallet } from '@/components/userChecker/addWallet'
import { useGlobalContext } from '@/context/MainContext'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

const Explore = () => {
  const {data:session} = useSession();
  const router = useRouter();

  const[username, setUserName] = useState<string>("");
  const[modal, setModal] = useState<boolean>(false);
  const[characterName, setCharacterName] = useState(0)
  // const{data:session} = useSession();

  const {user, getUser} = useGlobalContext();

  async function rename(){
    try{
      await axios.patch("/api/user/"+session?.user?.email, {username: username}).then((res)=>{
        setModal(false);
        getUser();
      });
    }
    catch(err){

    }
  }

 useEffect(()=>{
  // console.log(user, session?.user?.email);
 },[user]);

 useEffect(()=>{
  if(user?.contractAdd == ""){
    router.prefetch("/makeAuthor");
  }
  else{
    router.prefetch("/authors");
  }
  router.prefetch("/yourShelf");
 },[])

 const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])

  return (
    <div className=''>
      <div className={`w-screen ${modal ? "h-screen":"h-0"} z-[100] flex flex-col items-center justify-center overflow-hidden fixed top-0 left-0 duration-200 backdrop-blur-xl`}>
          <div className='w-80 p-4 bg-white rounded-xl'>
            <div className='flex gap-2 items-center justify-start'>
              <h2 className='text-2xl font-bold w-[90%]'>Set a username</h2>
              <div className='w-[10%]'>
                <button onClick={()=>{setModal(false)}} className='hover:text-red-500 flex items-end text-xl duration-200 text-gray-300' ><IoClose/></button>

              </div>
            </div>
              <h2 className='text-bold text-xs font-semibold'>Limit: {username.length}/15 characters</h2>
              <input onKeyDown={(e)=>{if(characterName == 15 && e.key == "Backspace"){setCharacterName((prev)=>(prev-1))}}} placeholder="Enter Username..." onChange={(e) => { if(characterName < 15){setUserName(e.target.value); setCharacterName(e.target.value.length) }}} value={username} className={`p-2 placeholder:text-gray-300 my-2 w-full peer focus:outline-none  focus:border-black focus:border-2 rounded-xl border-[1px] duration-200 `}></input>
              <button onClick={rename} className='font-bold text-white w-full bg-black h-10 rounded-lg hover:-translate-y-1 duration-200' >Save</button>
          </div>
      </div>
      {/* <div className='relative z-[100]'>
        <Navbar/>
      </div> */}
      <div className='flex gap-4 w-full px-5 items-center justify-start'>
        <h2 className="text-[2.5rem] max-md:text-[1.7rem] font-bold my-4 ">Hi, {user?.username.split(" ")[0]}</h2>
        <button onClick={()=>{setModal(true)}} className='text-gray-500 flex items-center justify-center bg-gray-100 duration-200 hover:brightness-90 p-3 text-xl rounded-lg'><FaEdit/></button>
      </div>

        <Highlights/>
        <PublicLibrary/>
    </div>
  )
}

export default Explore