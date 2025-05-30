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
import { IoLogOut } from 'react-icons/io5'
import Link from 'next/link'
import { CgUser } from 'react-icons/cg'

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  // const {setIsLoading} = useLoading()

  // useEffect(()=>{
  //   setIsLoading(false)
  // },[])

  const {user, getUser, night, setNight, setUser} = useGlobalContext();
  const {data: session} = useSession();

  const [walletNotAvailable, setWalletNotAvailable] = useState(false);
  const { address, isConnected, isReconnecting } = useAccount();
  const [bringModal, setBringModal] = useState<boolean>(false);
  const[bringSearchBar, setBringSearchBar] = useState<boolean>(false);
  const[search, setSearch] = useState<string>("")
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();
  router.prefetch("/");
  const pathName = usePathname()

  // Improved logout function
  const handleLogout = async () => {
    if (isSigningOut) return; // Prevent multiple logout attempts
    
    try {
      setIsSigningOut(true);
      setBringModal(false);
      setIsOpen(false);
      
      // Clear user data from context first
      setUser(null);
      
      // Sign out with NextAuth
      await signOut({redirect: true, callbackUrl: "/"});
      
    } catch (error) {
      console.error("Error during logout:", error);
      setIsSigningOut(false);
    }
  };

  useEffect(()=>{
    setIsOpen(false);
    setBringModal(false);
  },[pathName])

  useEffect(()=>{
    if(session && !user) {
      getUser()
    }
  },[session, user, getUser])

  useEffect(()=>{
    console.log("Night mode changed to: ", night);
  },[night])

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bringModal && !(event.target as Element).closest('.relative')) {
        setBringModal(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bringModal]);

  initializeTheme();

  return (<>
    <div className={`dark:bg-nifty-black bg-white duration-200 w-screen flex items-center justify-between h-16 fixed top-0 left-0 z-[1000] md:px-5 `}>
      <div className='w-1/2 pl-4'>
        <button onClick={()=>{router.push("/");
    router.refresh()}} className='flex items-center gap-2'>
          <Image src={night ? logo_night : logo} alt="logo" width={1080} height={1080} className='w-10 h-10 object-cover object-center' />
          <h1 className={`font-bold text-xl dark:text-white text-nowrap text-black`}>Nifty Tales</h1>
        </button>
      </div>
      <div className='md:w-1/2 flex gap-0 h-10 justify-end' >
      {/* MOBILE NAVBAR */}
        <div className='md:hidden flex gap-4 items-center justify-center'>
        {user && <>
          <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />

          {pathName.split("/")[1] !== "register" && <button className='text-gray-500 -ml-4 mr-2 p-1 text-2xl hover:bg-gray-2 bg-gray-100 hover:bg-gray-200 duration-200 rounded-full flex items-center justify-center group' ><> <Image width={1080} height={1080} src={user?.profileImage == "" ? logo : user?.profileImage as string } alt="dp" className='group-hover:scale-105 group-hover:brightness-50 w-8 h-8 rounded-full object-cover object-center duration-200' /></></button>}
       </>}
          <button onClick={()=>{setBringSearchBar(true)}} >
            <FaSearch className={` dark:text-white text-black`}/>
          </button>

          <button onClick={()=>{setIsOpen(prev=>!prev)}} className={`flex p-2 mr-2 gap-[1px] flex-col dark:text-white text-blackgap-1`}>
            <div className={`rounded-full duration-300  w-5 h-[3px] dark:bg-white bg-black ${isOpen && " rotate-45 translate-y-[2px] "}`}></div>
            {!isOpen && <div className={`rounded-full dark:bg-white bg-black w-5 h-[3px]`}></div>}
            <div className={`rounded-full duration-300 w-5 h-[3px] dark:bg-white bg-black ${isOpen && " -rotate-45 -translate-y-[2px]"}`}></div>
          </button>
        </div>

        <div className='flex items-center gap-2 max-md:hidden'>
          {/* PC NAVBAR */}
            <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />

            <button className='mr-2 hover:bg-gray-400/30 duration-200 bg-gray-400/20 rounded-full p-3' onClick={()=>{setBringSearchBar(true)}} >
              <FaSearch className={`dark:text-white text-black`}/>
            </button>

            {!pathName.split("/").includes("explore") && <button onClick={()=>{router.push("/explore")}} className={`dark:text-white text-blacktext-md font-semibold hover:bg-black/5 w-28 h-10 rounded-lg hover:brightness-75 duration-200`}>Explore</button>}

{user || session?.walletAddress ? (
  <div className='flex gap-4 items-center justify-center'>
    {/* Wallet Connect Button - only show if wallet not available and on home/connect pages */}
    {walletNotAvailable && (pathName === "/" || pathName.includes("/connect")) ? (
      <WalletConnectButton />
    ) : (
      <>
        {/* Author/Start Button - don't show on authors page */}
        {!pathName.includes("/authors") && (
          <>
            {user?.contractAdd === "" ? (
              <button 
                onClick={() => router.push("/makeCollection")} 
                className='bg-[#000000] hover:-translate-y-1 duration-200 rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'
              >
                Start <FaPenNib className='text-xl' />
              </button>
            ) : (
              <button 
                onClick={() => router.push(`/authors/${address}`)} 
                className='bg-[#000000] hover:-translate-y-1 duration-200 rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'
              >
                Author <MdOutlineDashboard className='text-xl' />
              </button>
            )}
          </>
        )}
        
        {/* Reader Dashboard Button */}
        {pathName?.split("/")[1] === "yourShelf" ? (
          <button 
            disabled 
            className='bg-gray-200 rounded-lg text-[#000000] cursor-not-allowed opacity-60 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-48 my-4 max-md:mx-auto'
          >
            {user?.username?.slice(0, 12)}
          </button>
        ) : (
          <button 
            onClick={() => router.push("/yourShelf")} 
            className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'
          >
            Reader <MdOutlineDashboard className='text-xl' />
          </button>
        )}
      </>
    )}
  </div>
) : (
  <WalletConnectRegister />
)}
          {user && (
            <div className="relative">
              <button 
                onClick={() => setBringModal(!bringModal)}
                className='text-gray-500 p-[1px] h-10 w-10 overflow-hidden text-2xl bg-gray-100 hover:bg-gray-200 duration-200 rounded-full flex items-center justify-center group'
              >
                {user?.profileImage == "" &&
                  <div className='flex items-center h-10 w-10 justify-center'>
                    <Image 
                      src={logo} 
                      alt='logo' 
                      width={1080} 
                      height={1080} 
                      className='duration-200 rounded-full group-hover:scale-105' 
                    />
                  </div>
                }
                {user?.profileImage !== "" && 
                  <div className='flex items-center object-center object-cover justify-center'>
                    <Image 
                      src={user?.profileImage as string} 
                      alt='profile' 
                      width={1080} 
                      height={1080} 
                      className='w-full h-full object-cover object-center duration-200 rounded-full group-hover:scale-105' 
                    />
                  </div>
                }
              </button>
              
              {/* Dropdown Menu */}
              {bringModal && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-nifty-black z-50">
                  <div className="rounded-md ring-1 ring-black ring-opacity-5 py-1">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.username?.slice(0, 15)}{user?.username?.length > 15 ? "..." : ""}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    
                    <ul>
                      <li className="hover:bg-gray-100 dark:hover:bg-gray-800">
                        <button 
                        disabled
                          onClick={() => { router.push("/profile"); setBringModal(false); }}
                          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left flex items-center opacity-50 cursor-not-allowed"
                        >
                          <CgUser className="mr-2" /> Profile
                        </button>
                      </li>
                      
                      <li className="hover:bg-gray-100 dark:hover:bg-gray-800">
                        <button 
                          disabled={isSigningOut}
                          onClick={handleLogout}
                          className="px-4 py-2 text-sm text-red-600 dark:text-red-400 w-full text-left flex items-center disabled:opacity-50"
                        >
                          <IoLogOut className="mr-2" /> 
                          {isSigningOut ? "Signing out..." : "Log out"}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={()=>{toggleDarkMode(); setNight((prev) => !prev)}} className={` dark:hover:bg-white/20 hover:bg-black/20 mx-2 w-10 h-10 rounded-full duration-200`} >{night ? <LuSun className='text-white mx-auto' /> : <FaMoon className='text-black mx-auto'/>}</button>
</div>
    </div>
    <div className={`w-screen dark:bg-nifty-black dark:text-white bg-white text-black fixed shadow-xl shadow-black/25 font-bold rounded-b-lg duration-300 z-[1000] top-16 left-0 -translate-y-96 ${isOpen && " translate-y-0 font-bold "}`}>
          <ul className='w-full pb-5 px-5 flex flex-col gap-4'>
            <li className='border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);;router.push("/explore");}} >Explore</li>
            {pathName.split("/")[1] == "yourShelf" ? <li className='border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);;router.push("/yourShelf");}} >{user?.username}</li> : <li className='border-b-[1px] border-gray-300' onClick={()=>{setIsOpen(false);;router.push("/yourShelf")}} >Reader Dashboard</li>}
            {user && user?.contractAdd == "" ? <li className='font-bold border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);;router.push("/makeCollection");}} >Become an Author</li>: <li onClick={()=>{setIsOpen(false);;router.push("/authors/")}} className='font-bold border-b-[1px] border-gray-300'>Author Dashboard</li>}
            <li className='border-b-[1px] border-gray-300' >
              <button 
                disabled={isSigningOut}
                onClick={handleLogout} 
                className='hover:brightness-125 justify-start items-center font-bold duration-200 rounded-bl-xl hover:bg-white/50 w-full flex gap-2 disabled:opacity-50'
              >
                <IoLogOut className="mr-2" /> 
                {isSigningOut ? "Signing out..." : "Logout"}
              </button>
            </li>
          </ul>
        </div>
    </>
  )
}

export default Navbar