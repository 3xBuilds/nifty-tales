'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { logo } from '@/assets/assets'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { IoIosLogOut, IoMdWallet } from 'react-icons/io'
import { useGlobalContext } from '@/context/MainContext'
import { WalletConnectButton } from '../buttons/WalletConnectButton'
import { MdAccountCircle, MdLogout, MdOutlineDashboard } from 'react-icons/md'
import { FaPenNib, FaSearch } from 'react-icons/fa'
import { Search } from '../Global/Search'

import { useLoading } from '../PageLoader/LoadingContext'
import { AddEmail } from '../userChecker/addEmail'
import { useAccount } from 'wagmi'

const Navbar = () => {

  const [isOpen, setIsOpen] = React.useState(false);
  const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])
  const [showLogout, setShowLogout] = useState<boolean>(false);

  const[bringSearchBar, setBringSearchBar] = useState<boolean>(false);
  const[search, setSearch] = useState<string>("")

  const {user, ensImg} = useGlobalContext();
  const {address} = useAccount();

  const router = useRouter();
  const pathName = usePathname()

  const {data: session} = useSession();

  function handleSignOut(){
    signOut()
  }


  return (<>
    <div className='bg-white w-screen flex items-center justify-between h-16 fixed top-0 left-0 z-[40] md:px-5 '>
    {user?.email.includes("@wallet") && <AddEmail/>}

    {user && address && user?.wallet != address && <div className="w-screen h-screen text-sm backdrop-blur-xl flex flex-col items-center justify-center fixed top-0 left-0 z-[10000000000000000]"><div className="p-4 bg-white w-96 rounded-lg shadow-xl shadow-black/30">Wallet address you're trying to connect is linked to another account. <b className="block mt-5">Go to your wallet and connect {user.wallet}.</b> </div></div>}


        <button onClick={()=>{setIsLoading(true);router.push("/explore")}} className='flex items-center'>
            <Image src={logo} alt='logo' className='w-10 h-10 max-md:w-8 max-md:h-8 ml-4' />
            <h1 className='text-2xl max-md:text-base font-bold ml-2'>Nifty Tales</h1>
        </button>

        <div className='md:hidden flex gap-4 items-center justify-center'>

          <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />


          <button onClick={()=>{setBringSearchBar(true)}} >
            <FaSearch/>
          </button>

          {pathName.split("/")[1] !== "register" && <button className='text-gray-500 p-1 text-2xl hover:bg-gray-2 bg-gray-100 hover:bg-gray-200 duration-200 rounded-full flex items-center justify-center group' >{user?.profileImage == "" ? <IoMdWallet/> :<> <MdLogout className='text-xl group-hover:opacity-100 opacity-0 duration-200 text-white absolute z-[10000]'/><Image width={1080} height={1080} src={user?.profileImage == "" ? ensImg !== "" ? ensImg : logo : user?.profileImage as string } alt="dp" className='group-hover:scale-105 group-hover:brightness-50 w-10 h-10 rounded-full object-cover object-center duration-200' /></>}</button>}


          <button onClick={()=>{setIsOpen(prev=>!prev)}} className='flex p-2 mr-2 flex-col gap-1'>
            <div className={`rounded-full duration-300 bg-black w-5 h-[3px] ${isOpen && " rotate-45 translate-y-[3px] "}`}></div>
            {!isOpen && <div className='rounded-full bg-black w-5 h-[3px]'></div>}
            <div className={`rounded-full duration-300 bg-black w-5 h-[3px] ${isOpen && " -rotate-45 -translate-y-[4px] "}`}></div>
          </button>
        </div>


        <div className='flex items-center gap-2 max-md:hidden'>
          
          <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />

          <button className='mr-2 hover:bg-gray-200 duration-200 bg-gray-100 rounded-full p-3' onClick={()=>{setBringSearchBar(true)}} >
            <FaSearch/>
          </button>

          {!pathName.split("/").includes("explore") && <button onClick={()=>{setIsLoading(true);router.push("/explore")}} className='text-black text-sm font-semibold hover:bg-black/5 w-28 h-10 rounded-lg hover:brightness-75 duration-200'>Explore</button>}


          {session &&  <div className='flex gap-4 items-center justify-center'>
            {pathName.split("/")[pathName.split("/").length-1] !== "authors" && <>
              { user && user?.contractAdd == "" ? <button onClick={()=>{setIsLoading(true);router.push("/makeAuthor")}} className='bg-[#000000] hover:-translate-y-1 duration-200 rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Start <FaPenNib className='text-xl' /></button>: <button onClick={()=>{setIsLoading(true);router.push("/authors")}} className='bg-[#000000] hover:-translate-y-1 duration-200 rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Author <MdOutlineDashboard className='text-xl' /></button>}
            </>}
            {pathName.split("/")[1] == "yourShelf" ? <button onClick={()=>{setIsLoading(true);router.push("/yourShelf")}} className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>{user?.username.slice(0,8)}</button> : <button onClick={()=>{setIsLoading(true);router.push("/yourShelf")}} className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Reader <MdOutlineDashboard className='text-xl'/></button>}

            <button onClick={()=>{signOut()}} className='text-gray-500 p-1 text-2xl hover:bg-gray-2 bg-gray-100 hover:bg-gray-200 duration-200 rounded-full flex items-center justify-center group' >{user?.profileImage == "" ? <IoMdWallet/> :<> <MdLogout className='text-xl group-hover:opacity-100 opacity-0 duration-200 text-white absolute z-[10000]'/><Image width={1080} height={1080} src={user?.profileImage == "" ? ensImg !== "" ? ensImg : logo : user?.profileImage+"?v="+String(Date.now()) as string } alt="dp" className='group-hover:scale-105 group-hover:brightness-50 w-10 h-10 rounded-full object-cover object-center duration-200' /></>}</button>
            <div className={`${showLogout ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[40rem]"} duration-500 absolute right-4 top-16 flex flex-col items-end justify-end gap-2 `} >
              {/* <WalletConnectButton/> */}
              <button onClick={()=>{handleSignOut()}} className='bg-[#eeeeee] rounded-lg text-[#000000] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-32 max-md:mx-auto'> <IoIosLogOut className='text-xl'/> Logout </button>
            </div>
            </div>}
            
        {/* <button className='bg-[#eeeeee] hover:bg-[#d3d3d3] rounded-lg text-[#171717] h-10 font-semibold px-5'> Wallet Connect </button> */}
        </div>
    </div>
    <div className={`w-screen bg-white fixed shadow-xl shadow-black/25 font-bold rounded-b-lg duration-300 z-30 top-16 left-0 -translate-y-96 ${isOpen && " translate-y-0 font-bold "}`}>
          <ul className='w-full pb-5 px-5 flex flex-col gap-4'>
            {/* <li><WalletConnectButton/></li> */}
            <li className='border-b-[1px] border-gray-300' onClick={()=>{setIsLoading(true);router.push("/explore")}} >Explore</li>
            {pathName.split("/")[1] == "yourShelf" ? <li className='border-b-[1px] border-gray-300' onClick={()=>{setIsLoading(true);router.push("/yourShelf")}} >{user?.username}</li> : <li className='border-b-[1px] border-gray-300' onClick={()=>{setIsLoading(true);router.push("/yourShelf")}} >Reader Dashboard</li>}
            {user && user?.contractAdd == "" ? <li className='font-bold border-b-[1px] border-gray-300' onClick={()=>{setIsLoading(true);router.push("/makeAuthor")}} >Become an Author</li>: <li onClick={()=>{setIsLoading(true);router.push("/authors/")}} className='font-bold border-b-[1px] border-gray-300'>Author Dashboard</li>}
            <li onClick={()=>{handleSignOut()}} className='font-bold text-red-500'>Logout</li>
          </ul>
        </div>
    </>
  )
}

export default Navbar