"use client"

import Highlights from '@/components/Explore/Highlights'
import PublicLibrary from '@/components/Explore/PublicLibrary'
import Navbar from '@/components/Home/Navbar'
import { useLoading } from '@/components/PageLoader/LoadingContext'
import { useGlobalContext } from '@/context/MainContext'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaPen } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import Image, { StaticImageData } from 'next/image'
import logo from "@/assets/profileImg.png"
import { toast } from "react-toastify";
import { useAccount, useEnsName } from 'wagmi'
import { AiOutlineLoading } from 'react-icons/ai'
import { RecommendedFetcher } from '@/components/fetcher/recommendedFetcher'
import { RiLoader5Fill } from 'react-icons/ri'


const Explore = () => {

  const {data:session} = useSession();
  const router = useRouter();
  const {address} = useAccount();
  const[username, setUserName] = useState<string>("");
  const[modal, setModal] = useState<boolean>(false);
  const[characterName, setCharacterName] = useState(0)

  const {user, getUser, ensImageFetcher, ensNameFetcher, night} = useGlobalContext();
  
  async function rename(){
    try{
      await axios.patch("/api/user/"+session?.user?.email, {username: username}).then((res)=>{
        setModal(false);
        getUser();
      });
    }
    catch(err:any){
      console.log(err);
      if(err?.response?.status == 501){
        toast.error(err.response.data.error);
      }
      else{
        toast.error("Error while changing name. Try again.")
      }
      setModal(false);
    }
  }

 useEffect(()=>{
  // console.log(user, session?.user?.email);
 },[user]);

 useEffect(()=>{
  if(user?.contractAdd == ""){
    router.prefetch("/makeCollection");
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

  const [imageModal, setImageModal] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const[profileImgLink, setProfileImgLink] = useState<string>("")

  const[loading, setLoading] = useState<boolean>(false);


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setProfileImg(e.target.files[0]);
    }
};

  async function handleSubmit(e:any) {

    //@ts-ignore
    if(session?.role == "ANONYMOUS"){
      toast.error("This action cannot be performed as a guest.")
      return ;
  }
    e.preventDefault();
    setLoading(true);
    if(!user?.wallet){
        setLoading(false);
        toast.error("Connect your wallet to continue");
        return;
    }

    try {

        // Create FormData object
        const formData = new FormData();

        //@ts-ignore
        if(profileImg){
          formData.append("profileImage", profileImg);
          formData.append("wallet", user.wallet);
        }


        // Upload to S3 using the API route
        const response = await axios.patch('/api/user/uploadDp', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });


        if (response.status !== 200) {
            toast.error("An error occurred while uploading.");
            return;
        }

        // Reset form fields
        if(response.status == 200){
            window.location.reload();
        }
        setLoading(false);
        // alert("Collection created successfully!");
    } catch (error:any) {
        setLoading(false);

        if(error.response.status == 501){
          toast.error(error.response.data.error);
        }
        else{
          toast.error("Error while uploading image. Try again.")
        }
        // console.log(error);
    }
}

async function tokenChecker() {
  try {
    const res = await axios.get("/api/tokenChecker");
    console.log(res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log(error, "WTF BRO")
      router.push('/connect');
    } else {
      console.error("An error occurred:", error);
    }
  }
}

useEffect(() => {
  tokenChecker();
}, []);

const [ensNameLoader, setEnsNameLoader] = useState<boolean>(false);
const [ensImageLoader, setEnsImageLoader] = useState<boolean>(false);

async function getUserEnsImage(){
  setEnsImageLoader(true);
  //@ts-ignore
  if(session?.role == "ANONYMOUS"){
    toast.error("This action cannot be performed as a guest");
    setEnsImageLoader(false);
    return ;
  }
  try{
    const res = await ensImageFetcher();
    if(res == false){
      setEnsImageLoader(false);
      toast.error("ENS image not found")
      setImageModal(false);
    }
    if(res){
      setEnsImageLoader(false);
      toast.success("ENS image updated!")
      setImageModal(false);
    }
  }
  catch(err){
    console.log(err);
    toast.error("Couldn't find ENS image");
    setEnsImageLoader(false);
  }
}

useEffect(()=>{
  if(user && user.username.includes("-wallet")){
    ensNameFetcher()
  }
  if(user && user?.profileImage == ""){
    ensImageFetcher();
  }
},[user])

async function getUserEnsName(){
  setEnsNameLoader(true);
  //@ts-ignore
  if(session?.role == "ANONYMOUS"){
    toast.error("This action cannot be performed as a guest");
    setEnsNameLoader(false);
    return ;
  }
  try{
    const res = await ensNameFetcher();
    if(res == false){
      setEnsNameLoader(false);
      toast.error("ENS name not found")
      setModal(false);
    }
    if(res){
      setEnsNameLoader(false);
      toast.success("ENS name updated!")
      setModal(false);
    }
    
  }
  catch(err){
    console.log(err);
    toast.error("Couldn't find ENS Name");
    setEnsNameLoader(false);
  }
}


  return (
    <div className={` ${night ? "text-white bg-[#212121]" : "text-black bg-white"} duration-200 min-h-screen`}>
        <div className={`w-screen h-screen fixed z-[-1] ${night ? "bg-[#212121]" : "bg-white"}`}></div>
        <div className={`h-screen w-screen backdrop-blur-xl z-[100] flex items-center justify-center fixed top-0 ${imageModal ? "translate-y-0": "-translate-y-[120rem]"} duration-300 ease-in-out left-0`}>
                <div className={`${night ? "bg-[#313131]" : "bg-white"}  shadow-xl shadow-black/30 gap-4 max-md:w-[90%] h-84 w-80 rounded-xl p-4 flex flex-col items-center justify-center`} >
                    <div className="w-full items-end flex justify-end text-xl"><button onClick={()=>{setImageModal(false)}} className="text-gray-300 hover:text-red-500 duration-200" ><IoClose/></button></div>
                    <div>
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-48 h-48 border-2 border-jel-gray-3 border-dashed rounded-full cursor-pointer hover:bg-jel-gray-1">
                            <div className="flex flex-col items-center h-full w-full p-2 overflow-hidden justify-center rounded-lg">
                                {!profileImg ? <svg className={`w-8 h-8 ${night ? "text-white" : "text-black"} duration-200 `} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg> :
                                    <Image alt="hello" className='w-full h-full object-cover rounded-full hover:scale-110 hover:opacity-30 duration-300' width={1000} height={1000} src={!profileImg ? "" : (profileImg instanceof File ? URL.createObjectURL(profileImg) : profileImg)} />}
                            </div>
                            <input id="dropzone-file" type="file" accept='image/*' onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>
                    <div className='flex gap-2 w-full'>
                      <button onClick={()=>{getUserEnsImage()}} className='font-bold text-black w-1/2 bg-gray-200 h-10 rounded-lg hover:-translate-y-1 duration-200'>{ensImageLoader ? <RiLoader5Fill className='animate-spin mx-auto text-xl'/> : "Use ENS"}</button>
                      <button onClick={handleSubmit} className="py-2 bg-black max-md:text-sm w-1/2 flex items-center justify-center text-white font-bold gap-2 rounded-lg hover:-translate-y-1 duration-200">{loading ? <AiOutlineLoading className=' animate-spin text-white'/> : "Save"}</button>
                    </div>
                </div>
            </div>


      <div className={`w-screen ${modal ? "h-screen":"h-0"} z-[100] flex flex-col items-center justify-center overflow-hidden fixed top-0 left-0 duration-200 backdrop-blur-xl`}>
          <div className={`w-80 p-4 ${night ? "bg-[#313131]" : "bg-white"} shadow-xl shadow-black/30 rounded-xl`}>
            <div className='flex gap-2 items-center justify-start'>
              <h2 className={`text-2xl font-bold ${night ? "text-white" : "text-black"} duration-200 w-[90%]`}>Set a username</h2>
              <div className='w-[10%]'>
                <button onClick={()=>{setModal(false)}} className='hover:text-red-500 flex items-end text-xl duration-200 text-gray-300' ><IoClose/></button>

              </div>
            </div>
              <h2 className={` ${night ? "text-white" : "text-black"} duration-200 text-bold text-xs font-semibold`}>Limit: {username?.length}/15 characters</h2>
              <input onKeyDown={(e)=>{if(characterName == 15 && e.key == "Backspace"){setCharacterName((prev)=>(prev-1))}}} placeholder="Enter Username..." onChange={(e) => { if(characterName < 15){setUserName(e.target.value); setCharacterName(e.target.value.length) }}} value={username} className={`p-2 placeholder:text-gray-300 my-2 w-full peer focus:outline-none bg-gray-200/20  ${night ? "focus:border-white" : "focus:border-black"}focus:border-black focus:border-2 ${night ? "text-white" : "text-black"} duration-200 rounded-xl border-[1px] duration-200 `}></input>
              
              <div className='flex gap-2 '>
                <button onClick={()=>{getUserEnsName()}} className='font-bold text-black w-1/2 bg-gray-200 h-10 rounded-lg hover:-translate-y-1 duration-200'>{ensNameLoader ? <RiLoader5Fill className='animate-spin mx-auto text-xl'/> : "Use ENS"}</button>
                <button onClick={rename} className='font-bold text-white w-1/2 bg-black h-10 rounded-lg hover:-translate-y-1 duration-200' >Save</button>
              </div>
          </div>
      </div>
      {/* <div className='relative z-[100]'>
        <Navbar/>
      </div> */}
      <div className='flex max-md:flex-col gap-4 w-full px-5 items-center justify-start pt-10 -mt-10'>
        <button onClick={()=>{setImageModal(true)}} className='rounded-full w-28 h-28 group border-4 border-black overflow-hidden flex items-center justify-center relative'>
          {/* @ts-ignore */}
          <Image width={1080} height={1080} src={user?.profileImage == "" ? logo : user?.profileImage+"?v="+Date.now() } alt="dp" className='group-hover:scale-105 group-hover:brightness-75 w-full h-full object-cover object-center duration-200' />
          <FaPen className="group-hover:opacity-100 opacity-0 duration-200 absolute z-50 text-xl text-white brightness-200" />
        </button>
        <div className='flex gap-2 items-center justify-center'>
          {/* @ts-ignore */}
        <h2 className="text-[2.5rem] max-md:text-[1.7rem] font-bold my-4 ">Hi, {user?.username?.split(" ")[0]?.substring(0,12)}{user?.username?.split(" ")[0]?.length>12 && "..."}</h2>
        <button onClick={()=>{setModal(true)}} className='text-gray-500 flex items-center justify-center bg-gray-100 duration-200 hover:brightness-90 p-3 text-xl rounded-lg'><FaEdit/></button>
          </div>
      </div>

        <Highlights/>
       <RecommendedFetcher/>
    </div>
  )
}

export default Explore