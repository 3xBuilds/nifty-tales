'use client'
import Image from 'next/image'
import React from 'react'
import { logo } from '@/assets/assets'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { IoIosLogOut } from 'react-icons/io'
import { useGlobalContext } from '@/context/MainContext'
import { WalletConnectButton } from '../buttons/WalletConnectButton'

const Navbar = () => {

  const [isOpen, setIsOpen] = React.useState(false);

  const {user} = useGlobalContext();

  const router = useRouter();

  const {data: session} = useSession();

  function handleSignOut(){
    signOut({ callbackUrl: '/beta/login' })

  }

  return (<>
    <div className='bg-white w-screen flex items-center justify-between h-16 fixed top-0 left-0 z-40 md:px-10'>
        <div className='flex items-center'>
            <Image src={logo} alt='logo' className='w-10 h-10 max-md:w-8 max-md:h-8 ml-4' />
            <h1 className='text-2xl max-md:text-base font-bold ml-2'>Nifty Tales</h1>
        </div>

        
        <button onClick={()=>{setIsOpen(prev=>!prev)}} className='flex p-2 mr-2 flex-col gap-1 md:hidden'>
          <div className={`rounded-full duration-300 bg-black w-5 h-[3px] ${isOpen && " rotate-45 translate-y-[3px] "}`}></div>
          {!isOpen && <div className='rounded-full bg-black w-5 h-[3px]'></div>}
          <div className={`rounded-full duration-300 bg-black w-5 h-[3px] ${isOpen && " -rotate-45 -translate-y-[4px] "}`}></div>
        </button>


        

        <div className='flex items-center gap-2 max-md:hidden'>
          
          {!session ? <button onClick={()=>{router.push("/register")}} className='bg-[#171717] rounded-lg text-[#eeeeee] h-10 font-semibold px-5 w-52 my-4 max-md:mx-auto'> Pre-Register </button> : <div className='flex gap-2 items-center justify-center'>
            {user?.contractAdd == "" ? <button onClick={()=>{router.push("/beta/makeAuthor")}} className='bg-[#000000] rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-52 my-4 max-md:mx-auto'>Become an Author</button>: <button onClick={()=>{router.push("/authors/"+user?.contractAdd)}} className='bg-[#000000] rounded-lg text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-52 my-4 max-md:mx-auto'>Author Dashboard</button>}
            <WalletConnectButton/>
            <button onClick={()=>{handleSignOut()}} className='bg-[#eeeeee] rounded-lg text-[#000000] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-32 my-4 max-md:mx-auto'> <IoIosLogOut className='text-xl'/> Logout </button>
            </div>}
            
        {/* <button className='bg-[#eeeeee] hover:bg-[#d3d3d3] rounded-lg text-[#171717] h-10 font-semibold px-5'> Wallet Connect </button> */}
        </div>
    </div>
    <div className={`w-screen bg-white fixed shadow-xl shadow-black/25 rounded-b-lg duration-300 z-30 top-16 left-0 -translate-y-96 ${isOpen && " translate-y-0 "}`}>
          <ul className='w-full pb-5 px-5 flex flex-col gap-2'>
            <li onClick={()=>{router.push("/")}}>Home</li>
            {user?.contractAdd == "" ? <li className='font-bold' onClick={()=>{router.push("/beta/makeAuthor")}} >Become an Author</li>: <li onClick={()=>{router.push("/authors/"+user?.contractAdd)}} className='font-bold'>Author Dashboard</li>}
            {!session ? <li onClick={()=>{router.push("/register")}} className='font-bold'>Pre-Register</li> : <li onClick={()=>{handleSignOut()}} className='font-bold text-red-500'>Logout</li>}
          <li><WalletConnectButton/></li>
          </ul>
        </div>
    </>
  )
}

export default Navbar