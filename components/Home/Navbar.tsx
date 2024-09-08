'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { logo } from '@/assets/assets'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { IoIosLogOut, IoIosMenu, IoIosSettings, IoMdLogOut, IoMdWallet } from 'react-icons/io'
import { useGlobalContext } from '@/context/MainContext'
import { WalletConnectButton } from '../buttons/WalletConnectButton'
import { MdAccountCircle, MdLogout, MdOutlineDashboard } from 'react-icons/md'
import { FaPenNib, FaSearch, FaSignOutAlt } from 'react-icons/fa'
import { Search } from '../Global/Search'

import { useLoading } from '../PageLoader/LoadingContext'

import { useAccount, useEnsName } from 'wagmi'
import { useEnsAvatar } from 'wagmi'
import axios from 'axios'
import { toast } from 'react-toastify'
import { WalletConnectRegister } from '../buttons/WalletConnectRegister'
import { ImCross } from 'react-icons/im'


const Navbar = () => {

  const [isOpen, setIsOpen] = React.useState(false);
  const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])

  const[openSettingsModal, setOpenSettingsModal] = useState(false);
  const {user, ensImg, setEnsImg, getUser} = useGlobalContext();
  const {data: session} = useSession();

  const [walletNotAvailable, setWalletNotAvailable] = useState(false);

  const { address, isConnected, isReconnecting } = useAccount();
  const { data: ensName, isLoading: isLoadingName } = useEnsName({ address: address});
  const { data: ensAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({ name:ensName as string });
  const [confirmBox, setConfirmBox] = useState(false);
  const [bringModal, setBringModal] = useState<boolean>(false);

  async function ensImageSetter(){
    try{
      setEnsImg(ensAvatar as string)
      // console.log("THIS IS AVATAR", ensAvatar, ensName);
      await axios.patch("/api/user/"+session?.user?.email,{profileImage: ensAvatar})
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    if(ensName && ensAvatar && session && user){
      ensImageSetter();
    }
  },[ensAvatar, session, user])

  const[bringSearchBar, setBringSearchBar] = useState<boolean>(false);
  const[search, setSearch] = useState<string>("")


  const router = useRouter();
  const pathName = usePathname()

  useEffect(()=>{

    if(!address && session){
      setWalletNotAvailable(true);
    }
    if(address){
      setWalletNotAvailable(false);
    }
  },[address, session, isConnected])

  useEffect(()=>{
    setIsOpen(false);
    setBringModal(false);
  },[pathName])

  async function deleteUser(){
    try{
      await axios.delete("/api/user/delete/"+session?.user?.email).then((res)=>{
        toast.success("User successfully deleted");
        signOut();
        router.push("/connect");
      });
    }
    catch(err){
      console.log(err);
      toast.error("Error while deleting user!");
    }
  }


  if(pathName.split("/")[1] !== "connect" && pathName.split("/")[1] !== "")
  return (<>
    <div className='bg-white w-screen flex items-center justify-between h-16 fixed top-0 left-0 z-[40] md:px-5 '>

    <div className={` w-40 flex flex-col items-center justify-center rounded-l-xl absolute right-0 top-16 ${bringModal ? "translate-x-0" : "translate-x-[30rem]"} absolute duration-200 bg-gray-200 border-2 border-nifty-gray-2/30 text-nifty-gray-2 `}>
      {/* @ts-ignore */}
      {session?.role != "ANONYMOUS" && <button onClick={()=>{
        setOpenSettingsModal(true);
      }} className='h-10 hover:brightness-125 justify-center items-center font-bold duration-200 rounded-tl-xl hover:translate-x-1 w-full flex gap-2'><IoIosSettings/>Settings</button>}
      <button onClick={()=>{signOut({callbackUrl: "/connect"})}} className='h-10 hover:brightness-125 justify-center items-center font-bold duration-200 rounded-bl-xl hover:translate-x-1 w-full flex gap-2'><MdLogout/>Logout</button>
    </div>

    {/* SETTINGS */}
    {/* @ts-ignore */}
    {session?.role != "ANONYMOUS" && <div className={` ${openSettingsModal ? "translate-y-0" : "-translate-y-[300rem]"} flex items-center justify-center duration-200 fixed h-screen w-screen backdrop-blur-xl top-0 left-0 z-[500]`}>
      <div className='w-80 shadow-xl shadow-black/30 bg-white rounded-xl p-4'>
        <div className='flex'>
          <h2 className='text-black w-1/2 text-2xl font-bold'>Settings</h2>
          <button onClick={()=>{setOpenSettingsModal(false)}} className='w-1/2 flex justify-end items-center text-black hover:text-red-600 duration-200'><ImCross/></button>
        </div>
        <div className='flex flex-col mt-4 items-center h-full gap-2'>
          <h2 className='text-sm text-left w-full text-nifty-gray-2'>Use this action only if</h2>
          <ul className='list-disc ml-4 text-nifty-gray-1'>
            <li><h2 className='text-xs text-nifty-gray-1'>You have to connect the associated email/wallet to another account</h2></li>
            <li><h2 className='text-xs text-nifty-gray-1'>You don't have published books on this account.</h2></li>
          </ul>
          <h2 className='text-red-500 font-bold animate-bounce'>DESTRUCTIVE ACTION!</h2>
          <button onClick={()=>{setConfirmBox(true)}} className='w-full h-10 text-xl bg-red-500 hover:brightness-105 duration-200 text-white font-bold rounded-lg'>Delete Account</button>
        </div>
      </div>
    </div>}

    {/* CONFIRM DELETE BOX */}
    <div className={` ${confirmBox ? "translate-y-0" : "-translate-y-[300rem]"} flex items-center justify-center duration-200 fixed h-screen w-screen backdrop-blur-xl top-0 left-0 z-[501]`}>
      <div className='w-80 bg-white rounded-lg shadow-xl shadow-black/30 p-4 flex flex-col gap-2 items-center justify-center'>
        <h2 className='text-nifty-gray-2 text-xs'>This action is <b>IRREVERSIBLE!</b></h2>
        <div className='flex gap-2 items-center justify-center w-full'>
          <button onClick={()=>{deleteUser()}} className='bg-red-500 hover:-translate-y-1 duration-200 text-white font-semibold rounded-lg w-1/2 h-10'>Delete</button>
          <button onClick={()=>{setConfirmBox(false); setOpenSettingsModal(false)}} className='bg-gray-200 hover:-translate-y-1 font-semibold w-1/2 rounded-lg h-10 duration-200 '>Go Back</button>
        </div>
      </div>
    </div>

    {/* {user?.email.includes("@wallet") && <AddEmail/>} */}

    {user && user?.wallet != "" && address && user?.wallet != address && <div className="w-screen h-screen text-sm backdrop-blur-xl flex flex-col items-center justify-center fixed top-0 left-0 z-[10000000000000000]"><div className="p-4 bg-white w-80 rounded-lg shadow-xl shadow-black/30">Wallet address you're trying to connect is not linked to your account. <b className="block mt-5">Go to your wallet and connect {user?.wallet.slice(0,32)}...</b> <h3 className='my-4 font-bold'>OR</h3>
    <button className='text-black w-32 h-10 bg-gray-300 font-bold rounded-lg hover:-translate-y-1 duration-200' onClick={()=>{signOut(); router.push("/connect")}}>Sign Out</button> </div> </div>}

        <button onClick={()=>{setIsLoading(true);router.push("/")}} className='flex items-center'>
            <Image src={logo} alt='logo' className='w-10 h-10 max-md:w-8 max-md:h-8 ml-4' />
            <h1 className='text-2xl max-md:text-base font-bold ml-2'>Nifty Tales</h1>
            {/* <h2 className='text-xs text-nifty-gray-1/70 ml-2' >BETA</h2> */}
            <h2 className='text-xs text-red-500 ml-2' >BETA</h2>

        </button>

        {user?.role == "ADMIN" && <button onClick={()=>{router.push("/admin")}} className='text-xl text-black bg-gray-300 h-10 px-4 rounded-xl font-bold'>ADMIN</button>}


      {/* MOBILE NAVBAR */}
        <div className='md:hidden flex gap-4 items-center justify-center'>
        {session && <>
          <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />

          <button onClick={()=>{setBringSearchBar(true)}} >
            <FaSearch/>
          </button>

          <button onClick={()=>{setIsOpen(prev=>!prev)}} className='flex p-2 mr-2 flex-col gap-1'>
            <div className={`rounded-full duration-300 bg-black w-5 h-[3px] ${isOpen && " rotate-45 translate-y-[3px] "}`}></div>
            {!isOpen && <div className='rounded-full bg-black w-5 h-[3px]'></div>}
            <div className={`rounded-full duration-300 bg-black w-5 h-[3px] ${isOpen && " -rotate-45 -translate-y-[4px] "}`}></div>
          </button>

          {pathName.split("/")[1] !== "register" && !isLoadingAvatar && <button className='text-gray-500 -ml-4 mr-2 p-1 text-2xl hover:bg-gray-2 bg-gray-100 hover:bg-gray-200 duration-200 rounded-full flex items-center justify-center group' >{user?.profileImage == "" && ensImg == "" ? <div></div> :<> <Image width={1080} height={1080} src={user?.profileImage == "" ? ensImg !== "" ? ensImg : logo : user?.profileImage+"?v="+String(Date.now()) as string } alt="dp" className='group-hover:scale-105 group-hover:brightness-50 w-10 h-10 rounded-full object-cover object-center duration-200' /></>}</button>}
       </>}
       {!session && isConnected && !isReconnecting && pathName.split("/")[1] !== "register" && <><div className='h-screen w-screen backdrop-blur-2xl fixed flex top-0 right-0 justify-end pt-3 pr-3'><WalletConnectRegister/></div></> }


        </div>


        <div className='flex items-center gap-2 max-md:hidden'>
          
          {/* PC NAVBAR */}
          {session && <>
            <Search bringSearchBar={bringSearchBar} search={search} setSearch={setSearch} setBringSearchBar={setBringSearchBar} />

            <button className='mr-2 hover:bg-gray-200 duration-200 bg-gray-100 rounded-full p-3' onClick={()=>{setBringSearchBar(true)}} >
              <FaSearch/>
            </button>

            {!pathName.split("/").includes("explore") && <button onClick={()=>{setIsLoading(true);router.push("/explore")}} className='text-black text-md font-semibold hover:bg-black/5 w-28 h-10 rounded-lg hover:brightness-75 duration-200'>Explore</button>}

            {/* @ts-ignore */}
            {session && session.role != "ANONYMOUS" && <div className='flex gap-4 items-center justify-center'>
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
              {pathName.split("/")[1] == "yourShelf" ? <button disabled onClick={()=>{setIsLoading(true);router.push("/yourShelf")}} className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-48 my-4 max-md:mx-auto'>{user?.username.slice(0,12)}</button> : <button onClick={()=>{setIsLoading(true);router.push("/yourShelf")}} className='bg-gray-200 rounded-lg text-[#000000] hover:-translate-y-1 duration-200 h-10 font-semibold flex items-center justify-center gap-2 px-5 w-36 my-4 max-md:mx-auto'>Reader <MdOutlineDashboard className='text-xl'/></button>}
              {!walletNotAvailable && address && <WalletConnectButton/>}

              
              </div>} 
          </>}

          <button onClick={()=>{setBringModal((prev)=>!prev)}} className='text-gray-500 p-1 h-10 w-10 overflow-hidden text-2xl group hover:bg-gray-2 bg-gray-100 hover:bg-gray-200 duration-200 rounded-full flex items-center justify-center group' >{!ensImg && user?.profileImage == "" && <IoIosMenu className='text-lg text-black'/>}{ensImg && user?.profileImage == "" &&<div className='flex items-center h-10 w-10 justify-center'><IoIosMenu className='absolute text-white z-[10000] group-hover:opacity-100 opacity-0 duration-200' /><Image src={ensImg} alt='ensImg' width={1080} height={1080} className='group-hover:brightness-50 duration-200 rounded-full group-hover:scale-105' /></div>}{user?.profileImage !== "" && <div className='flex items-center object-center object-cover justify-center'><IoIosMenu className='absolute text-white z-[10000] group-hover:opacity-100 opacity-0 duration-200' /><Image src={user?.profileImage+"?v="+Date.now() as string} alt='ensImg' width={1080} height={1080} className='group-hover:brightness-50 object-fill object-center duration-200 rounded-full w-full group-hover:scale-105' /></div>}</button>
          {!session && isConnected && !isReconnecting && pathName.split("/")[1] !== "register" && <><div className='h-screen w-screen backdrop-blur-2xl fixed flex top-0 right-0  justify-end pt-3 pr-3'><WalletConnectRegister/></div></> }

        </div>
    </div>
    <div className={`w-screen bg-white fixed shadow-xl shadow-black/25 font-bold rounded-b-lg duration-300 z-30 top-16 left-0 -translate-y-96 ${isOpen && " translate-y-0 font-bold "}`}>
          <ul className='w-full pb-5 px-5 flex flex-col gap-4'>
            {/* <li><WalletConnectButton/></li> */}
            <li className='border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);setIsLoading(true);router.push("/explore");}} >Explore</li>
            {pathName.split("/")[1] == "yourShelf" ? <li className='border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);setIsLoading(true);router.push("/yourShelf");}} >{user?.username}</li> : <li className='border-b-[1px] border-gray-300' onClick={()=>{setIsOpen(false);setIsLoading(true);router.push("/yourShelf")}} >Reader Dashboard</li>}
            {user && user?.contractAdd == "" ? <li className='font-bold border-b-[1px] border-gray-300' onClick={()=>{ setIsOpen(false);setIsLoading(true);router.push("/makeCollection");}} >Become an Author</li>: <li onClick={()=>{setIsOpen(false);setIsLoading(true);router.push("/authors/")}} className='font-bold border-b-[1px] border-gray-300'>Author Dashboard</li>}
            {/* @ts-ignore */}
            {session?.role != "ANONYMOUS" && <li className='border-b-[1px] border-gray-300' ><button onClick={()=>{setOpenSettingsModal(true)}} className=' hover:brightness-125 justify-start items-center font-bold duration-200 rounded-tl-xl hover:bg-white/50 w-full flex gap-2'>Settings</button></li>}
            <li className='border-b-[1px] border-gray-300' ><button onClick={()=>{signOut({callbackUrl: "/connect"})}} className=' hover:brightness-125 justify-start items-center font-bold duration-200 rounded-bl-xl hover:bg-white/50 w-full flex gap-2'>Logout</button></li>
            <li className='' ><WalletConnectButton/></li>
          </ul>
        </div>
    </>
  )
}

export default Navbar