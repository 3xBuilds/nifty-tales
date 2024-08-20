'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { logo } from '@/assets/assets'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { IoIosLogOut } from 'react-icons/io'
import { useGlobalContext } from '@/context/MainContext'
import { WalletConnectButton } from '../buttons/WalletConnectButton'
import { MdAccountCircle, MdOutlineDashboard } from 'react-icons/md'
import { FaPenNib, FaSearch } from 'react-icons/fa'
import { Search } from '../Global/Search'
import { AddWallet } from '../userChecker/addWallet'

const Navbar = () => {

  const [isOpen, setIsOpen] = React.useState(false);
  const [showLogout, setShowLogout] = useState<boolean>(false);

  const[bringSearchBar, setBringSearchBar] = useState<boolean>(false);
  const[search, setSearch] = useState<string>("")

  const {user} = useGlobalContext();

  const router = useRouter();
  const pathName = usePathname()

  const {data: session} = useSession();

  function handleSignOut(){
    signOut()
  }

  return (<>
    <div className='bg-white w-screen flex items-center justify-between h-16 fixed top-0 left-0 z-[40] md:px-5 '>
    {user?.email.includes("@wallet") && <AddWallet/>}

        <button onClick={()=>{router.push("/explore")}} className='flex items-center'>
            <Image src={logo} alt='logo' className='w-10 h-10 max-md:w-8 max-md:h-8 ml-4' />
            <h1 className='text-2xl max-md:text-base font-bold ml-2'>Nifty Tales</h1>
        </button>

        <div className='md:hidden flex gap-4 items-center justify-center'>

          <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />


          <button onClick={()=>{setBringSearchBar(true)}} >
            <FaSearch/>
          </button>


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

          <button onClick={()=>{router.push("/explore")}} className='text-black text-sm font-semibold hover:bg-black/5 w-28 h-10 rounded-lg hover:brightness-75 duration-200'>Explore</button>


          {session &&  <div className='flex gap-4 items-center justify-center'>
            {pathName.split("/")[pathName.split("/").length-1] !== "authors" && <>
              { user && user?.contractAdd == "" ? <button onClick={()=>{router.push("/makeAuthor")}} className='bg-[#000000] hover:-translate-y-1 duration-200 rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Start <FaPenNib className='text-xl' /></button>: <button onClick={()=>{router.push("/authors")}} className='bg-[#000000] hover:-translate-y-1 duration-200 rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Author <MdOutlineDashboard className='text-xl' /></button>}
            </>}
            {pathName.split("/")[1] == "yourShelf" ? <button onClick={()=>{router.push("/yourShelf")}} className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-52 my-4 max-md:mx-auto'>{user?.username}</button> : <button onClick={()=>{router.push("/yourShelf")}} className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Reader <MdOutlineDashboard className='text-xl'/></button>}

            <button onClick={()=>{setShowLogout((prev)=>!prev)}} className='text-gray-500 p-2 text-2xl hover:bg-gray-2 bg-gray-100 hover:bg-gray-200 duration-200 rounded-full' ><MdAccountCircle/></button>
            <div className={`${showLogout ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[40rem]"} duration-500 absolute right-4 top-16 flex flex-col items-end justify-end gap-2 `} >
              <WalletConnectButton/>
              <button onClick={()=>{handleSignOut()}} className='bg-[#eeeeee] rounded-lg text-[#000000] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-32 max-md:mx-auto'> <IoIosLogOut className='text-xl'/> Logout </button>
            </div>
            </div>}
            
        {/* <button className='bg-[#eeeeee] hover:bg-[#d3d3d3] rounded-lg text-[#171717] h-10 font-semibold px-5'> Wallet Connect </button> */}
        </div>
    </div>
    <div className={`w-screen bg-white fixed shadow-xl shadow-black/25 font-bold rounded-b-lg duration-300 z-30 top-16 left-0 -translate-y-96 ${isOpen && " translate-y-0 font-bold "}`}>
          <ul className='w-full pb-5 px-5 flex flex-col gap-4'>
            <li><WalletConnectButton/></li>
            <li className='border-b-[1px] border-gray-300' onClick={()=>{router.push("/explore")}} >Explore</li>
            {pathName.split("/")[1] == "yourShelf" ? <li className='border-b-[1px] border-gray-300' onClick={()=>{router.push("/yourShelf")}} >{user?.username}</li> : <li className='border-b-[1px] border-gray-300' onClick={()=>{router.push("/yourShelf")}} >Reader Dashboard</li>}
            {user && user?.contractAdd == "" ? <li className='font-bold border-b-[1px] border-gray-300' onClick={()=>{router.push("/makeAuthor")}} >Become an Author</li>: <li onClick={()=>{router.push("/authors/")}} className='font-bold border-b-[1px] border-gray-300'>Author Dashboard</li>}
            {session && <li onClick={()=>{handleSignOut()}} className='font-bold text-red-500'>Logout</li>}
          </ul>
        </div>
    </>
  )
}

export default Navbar