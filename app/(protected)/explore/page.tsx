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
import TxnFetcher from '@/components/fetcher/txnFetcher'


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
    <div className={` dark:text-white dark:bg-nifty-black text-black bg-white duration-200 min-h-screen`}>
        <Highlights/>
       <RecommendedFetcher/>
       {/* <TxnFetcher/> */}
    </div>
  )
}

export default Explore