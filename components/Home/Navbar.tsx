'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import  {logo} from '@/assets/assets'
import logo_night from "@/assets/logo_night.png"
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { IoIosMenu, IoIosSettings} from 'react-icons/io'
import { useGlobalContext } from '@/context/MainContext'
import { WalletConnectButton } from '../buttons/WalletConnectButton'
import {MdLogout, MdOutlineDashboard } from 'react-icons/md'
import { FaMoon, FaPenNib, FaSearch, FaSignOutAlt } from 'react-icons/fa'
import { Search } from '../Global/Search'
import { LuSun } from "react-icons/lu";
import { useLoading } from '../PageLoader/LoadingContext'

import { useAccount } from 'wagmi'
import axios from 'axios'
import { toast } from 'react-toastify'
import { WalletConnectRegister } from '../buttons/WalletConnectRegister'
import { ImCross } from 'react-icons/im'
import { RiAdminLine } from 'react-icons/ri'
import { initializeTheme, toggleDarkMode } from '@/toggleDarkMode'



const Navbar = () => {

  const [isOpen, setIsOpen] = React.useState(false);
  const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])

  const[openSettingsModal, setOpenSettingsModal] = useState(false);
  const {user, night, setNight} = useGlobalContext();
  const {data: session} = useSession();

  const [walletNotAvailable, setWalletNotAvailable] = useState(false);

  const { address, isConnected, isReconnecting } = useAccount();

  const [confirmBox, setConfirmBox] = useState(false);
  const [bringModal, setBringModal] = useState<boolean>(false);

  const[bringSearchBar, setBringSearchBar] = useState<boolean>(false);
  const[search, setSearch] = useState<string>("")


  const router = useRouter();
  const pathName = usePathname()

  // useEffect(()=>{

  //   if(!address && session){
  //     setWalletNotAvailable(true);
  //   }
  //   if(address){
  //     setWalletNotAvailable(false);
  //   }
  // },[address, session, isConnected])

  useEffect(()=>{
    setIsOpen(false);
    setBringModal(false);
  },[pathName])


  // async function deleteUser(){
  //   try{
  //     await axios.delete("/api/user/delete/"+session?.user?.email).then((res)=>{
  //       toast.success("User successfully deleted");
  //       signOut();
  //       router.push("/connect");
  //     });
  //   }
  //   catch(err){
  //     console.log(err);
  //     toast.error("Error while deleting user!");
  //   }
  // }

  initializeTheme();

  return (<>
    <div className={`dark:bg-nifty-black bg-white duration-200 w-screen flex items-center justify-between h-16 fixed top-0 left-0 z-[1000] md:px-5 `}>
      <div className='w-1/2 pl-4'>
        <button onClick={()=>{setIsLoading(true);router.push("/explore")}} className='flex items-center gap-2'>
          <Image src={night ? logo_night : logo} alt="logo" width={1080} height={1080} className='w-10 h-10 object-cover object-center' />
          <h1 className={`font-bold text-xl dark:text-white text-nowrap text-black`}>Nifty Tales</h1>
        </button>
      </div>
      <div className='md:w-1/2 flex gap-0 h-10 justify-end' >
      {/* MOBILE NAVBAR */}
        <div className='md:hidden flex gap-4 items-center justify-center'>
        {session && <>
          <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />

          <button onClick={()=>{setBringSearchBar(true)}} >
            <FaSearch className={` dark:text-white text-black`}/>
          </button>

          <button onClick={()=>{setIsOpen(prev=>!prev)}} className={`flex p-2 mr-2 flex-col dark:text-white text-blackgap-1`}>
            <div className={`rounded-full duration-300  w-5 h-[3px] dark:bg-white bg-black ${isOpen && " rotate-45 translate-y-[3px] "}`}></div>
            {!isOpen && <div className={`rounded-full dark:bg-white bg-black w-5 h-[3px]`}></div>}
            <div className={`rounded-full duration-300 w-5 h-[3px] dark:bg-white bg-black ${isOpen && " -rotate-45 -translate-y-[4px] "}`}></div>
          </button>

          {pathName.split("/")[1] !== "register" && <button className='text-gray-500 -ml-4 mr-2 p-1 text-2xl hover:bg-gray-2 bg-gray-100 hover:bg-gray-200 duration-200 rounded-full flex items-center justify-center group' ><> <Image width={1080} height={1080} src={user?.profileImage == "" ? logo : user?.profileImage as string } alt="dp" className='group-hover:scale-105 group-hover:brightness-50 w-8 h-8 rounded-full object-cover object-center duration-200' /></></button>}
       </>}
       {/* {!session && isConnected && !isReconnecting && pathName.split("/")[1] !== "register" && <><div className='h-screen w-screen backdrop-blur-2xl fixed flex top-0 right-0 justify-end pt-3 pr-3'><WalletConnectRegister/></div></> } */}


        </div>


        <div className='flex items-center gap-2 max-md:hidden'>
          
          {/* PC NAVBAR */}
          {/* {session && <> */}
            <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />

            <button className='mr-2 hover:bg-gray-400/30 duration-200 bg-gray-400/20 rounded-full p-3' onClick={()=>{setBringSearchBar(true)}} >
              <FaSearch className={`dark:text-white text-black`}/>
            </button>

            {!pathName.split("/").includes("explore") && <button onClick={()=>{setIsLoading(true);router.push("/explore")}} className={`dark:text-white text-blacktext-md font-semibold hover:bg-black/5 w-28 h-10 rounded-lg hover:brightness-75 duration-200`}>Explore</button>}

            {/* @ts-ignore */}
            {user && <div className='flex gap-4 items-center justify-center'>
              <>{
                walletNotAvailable && (pathName.split("/")[0] == "" || pathName.split("/")[1] == "connect") ? <>
                  <WalletConnectButton/>
                </>:<>
                  {pathName.split("/")[pathName.split("/").length-1] !== "authors" && <>
                { user && user?.contractAdd == "" ? <button onClick={()=>{setIsLoading(true);router.push("/makeCollection")}} className='bg-[#000000] hover:-translate-y-1 duration-200 rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Start <FaPenNib className='text-xl' /></button>: <button onClick={()=>{setIsLoading(true);router.push("/authors")}} className='bg-[#000000] hover:-translate-y-1 duration-200 rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Author <MdOutlineDashboard className='text-xl' /></button>}  
                </>}
                </>
              }
              
              </>
              {pathName?.split("/")[1] == "yourShelf" ? <button disabled onClick={()=>{setIsLoading(true);router.push("/yourShelf")}} className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-48 my-4 max-md:mx-auto'>{user?.username?.slice(0,12)}</button> : <button onClick={()=>{setIsLoading(true);router.push("/yourShelf")}} className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Reader <MdOutlineDashboard className='text-xl'/></button>}
              {/* {!walletNotAvailable && address && <WalletConnectButton/>} */}

              
              </div>} 
          {/* </>} */}
          
          {session && <button onClick={()=>{router.push("/profile/"+address)}} className='text-gray-500 p-[1px] h-10 w-10 overflow-hidden text-2xl bg-gray-100 hover:bg-gray-200 duration-200 rounded-full flex items-center justify-center group' >{user?.profileImage == "" &&<div className='flex items-center h-10 w-10 justify-center'><IoIosMenu className='absolute text-white z-[10000] group-hover:opacity-100 opacity-0 duration-200' /><Image src={logo} alt='logo' width={1080} height={1080} className='group-hover:brightness-50 duration-200 rounded-full group-hover:scale-105' /></div>}{user?.profileImage !== "" && <div className='flex items-center object-center object-cover justify-center'><IoIosMenu className='absolute text-white z-[10000] group-hover:opacity-100 opacity-0 duration-200' /><Image src={user?.profileImage as string} alt='alt' width={1080} height={1080} className='group-hover:brightness-50 w-full h-full object-cover object-center duration-200 rounded-full group-hover:scale-105' /></div>}</button>}
          {/* {!session && isConnected && !isReconnecting && pathName.split("/")[1] !== "register" && <><div className='h-screen w-screen backdrop-blur-2xl fixed flex top-0 right-0  justify-end pt-3 pr-3'><WalletConnectRegister/></div></> } */}

        </div>

        <button onClick={()=>{toggleDarkMode(); setNight(prev => !prev)}} className={` dark:hover:bg-white/20 hover:bg-black/20 mx-2 w-10 h-10 rounded-full duration-200`} >{night ? <LuSun className='text-white mx-auto' /> : <FaMoon className='text-black mx-auto'/>}</button>
</div>
    </div>
    <div className={`w-screen dark:bg-nifty-black dark:text-white bg-white text-black fixed shadow-xl shadow-black/25 font-bold rounded-b-lg duration-300 z-[1000] top-16 left-0 -translate-y-96 ${isOpen && " translate-y-0 font-bold "}`}>
          <ul className='w-full pb-5 px-5 flex flex-col gap-4'>
            {/* <li><WalletConnectButton/></li> */}
            <li className='border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);setIsLoading(true);router.push("/explore");}} >Explore</li>
            {pathName.split("/")[1] == "yourShelf" ? <li className='border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);setIsLoading(true);router.push("/yourShelf");}} >{user?.username}</li> : <li className='border-b-[1px] border-gray-300' onClick={()=>{setIsOpen(false);setIsLoading(true);router.push("/yourShelf")}} >Reader Dashboard</li>}
            {user && user?.contractAdd == "" ? <li className='font-bold border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);setIsLoading(true);router.push("/makeCollection");}} >Become an Author</li>: <li onClick={()=>{setIsOpen(false);setIsLoading(true);router.push("/authors/")}} className='font-bold border-b-[1px] border-gray-300'>Author Dashboard</li>}
            {/* @ts-ignore */}
            {/* {session?.role != "ANONYMOUS" && <li className='border-b-[1px] border-gray-300' ><button onClick={()=>{setOpenSettingsModal(true)}} className=' hover:brightness-125 justify-start items-center font-bold duration-200 rounded-tl-xl hover:bg-white/50 w-full flex gap-2'>Settings</button></li>} */}
            <li className='border-b-[1px] border-gray-300' ><button onClick={()=>{signOut({callbackUrl: "/explore"})}} className=' hover:brightness-125 justify-start items-center font-bold duration-200 rounded-bl-xl hover:bg-white/50 w-full flex gap-2'>Logout</button></li>
            {/* @ts-ignore */}
            {/* {session?.role != "ANONYMOUS" && <li className='flex gap-2 items-center justify-center w-full' ><WalletConnectButton/>  <button onClick={()=>{if(night)localStorage.setItem('mode', "day"); else{localStorage.setItem('mode', "night")}setNight((prev)=>!prev);}} className={` ${night ? "hover:bg-white/20" : "hover:bg-black/20"} items-center flex justify-center bg-gray-300/40 w-1/2 mx-auto p-2 rounded-full duration-200`} >{night ? <LuSun className='text-white' /> : <FaMoon className='text-black'/>}</button>
            </li>} */}
          </ul>

        </div>
    </>
  )
}

export default Navbar