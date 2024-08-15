"use client"

import { usePathname } from "next/navigation"
import { ethers } from "ethers";
import abi from "@/utils/abis/templateABI"
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton";
import Navbar from "@/components/Home/Navbar";
import { useGlobalContext } from "@/context/MainContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Book from "@/components/Global/Book";

export default function Home(){

    const pathName = usePathname();

    const [address, setAddress] = useState<string>("")
    const [slicer, setSlicer] = useState<number>(0);
    const [user,setUser] = useState<UserType>()

    const[publishedBooks, setPublishedBooks] = useState([])


    useEffect(()=>{
        setAddress(pathName.split("/")[pathName.split("/").length-1]);
    },[pathName])

    const router = useRouter()

    const[profileImgLink, setProfileImgLink] = useState<string>("")
    const[bannerLink, setBannerLink] = useState<string>("")

    const[name, setName] = useState<string>("")

    async function contractSetup(){
        try {
            //@ts-ignore
            if (typeof window.ethereum !== 'undefined') {

                //@ts-ignore
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                //@ts-ignore
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                //@ts-ignore
                const contract = new ethers.Contract(user?.contractAdd, abi, signer);

            return contract;

            }

        }
        catch (err) {
            console.error(err);
        }
    }

    async function getContractDetails(){
        try{
            const contract = await contractSetup();
            const contractName = await contract?.name();

            setName(contractName);
        }
        catch(err){
            console.error(err);
        }
    }

    async function getUser(){
        try{
            await axios.get("/api/user/authors/"+address).then((res)=>{
                setUser(res.data.user);
                console.log(res.data.user);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        if(user){
            setProfileImgLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + user?.wallet + "/info/profileImage");
            setBannerLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + user?.wallet + "/info/bannerImage");
            getContractDetails();
        }
    },[user])

    useEffect(()=>{
        if(address){
            console.log(address);
            getUser();
        }
    },[address])

    useEffect(()=>{
        if(user){

            var arr1:any= []
            var subArr1:any = []



            user.yourBooks.reverse().map((item:any, i)=>{
                if(item.isPublished && !item.Hidden){
                    subArr1.push(item);
                }
                if(subArr1.length == slicer || i == user.yourBooks.length-1){
                    if(subArr1.length>0)
                    arr1.push(subArr1);
                    subArr1 = []
                }
                
            })

            //@ts-ignore
            setPublishedBooks(arr1);
            //@ts-ignore
        }
    },[slicer, user])

    useEffect(()=>{
        const screenWidth = window.innerWidth;

        if(screenWidth > 1100){
            setSlicer(5);
        }
        else if(screenWidth<=1100){
            setSlicer(4);
        }

    },[])

    return(
        <div className="">
            <div className="h-16 w-screen relative z-[100000]">
                <Navbar/>
            </div>
            <div className="w-screen relative h-[15rem] md:h-[22rem] max-md:flex items-center justify-center overflow-hidden object-fill ">
                <div className="w-screen absolute h-full overflow-hidden">
                    <Image width={1080} height={1080} src={bannerLink || ""} alt="dp" className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 brightness-75 -translate-y-1/2"/>
                </div>
                <div className="flex gap-8 object-center items-center h-full md:px-10 w-screen justify-center md:justify-start my-auto absolute z-50 backdrop-blur-xl">
                    <Image width={1080} height={1080} src={profileImgLink || ""} alt="dp" className="md:w-[10rem] md:h-[10rem] h-[6rem] w-[6rem] border-4 border-white rounded-full" />
                    <div className="flex flex-col gap-2">

                        <h2 className="md:text-5xl text-xl font-bold text-white">{user?.collectionName}</h2>
                        <a href={`https://basescan.org/address/${user?.contractAdd}`} target="_blank" className="md:text-md text-sm underline font-semibold text-white">{user?.contractAdd.substring(0,7)}...{user?.contractAdd.substring(user.contractAdd.length-7, user.contractAdd.length)}</a>
                    </div>
                </div>

            </div>

            { user && user?.yourBooks?.length == 0 ? <div className="w-screen h-[25rem] flex items-center justify-center flex-col">
                <h2 className="text-xl font-bold">No Published books!</h2>
            </div>: 
            <>

                {/* PUBLISHED BOOKS */}
                <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
                    <div className="flex items-center justify-center w-full mb-5">
                        <div className="w-full flex items-start justify-start ">
                            <h3 className="text-2xl font-bold ">Published</h3>
                        </div>
                        
                    </div>

                    {publishedBooks.map((item:any)=>(
                        <div className="w-full mb-5">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item.map((item2:any)=>(<div className="flex relative group flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                            <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 w-[80%] text-white rounded-b-xl to-black/50 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name}</h2>
                            </div>
                            <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                                <Book img={item2.cover} />
                            </button>
                        </div>
                        ))}
                        </div>
                            <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-black/20 relative z-10">
                            </div>
                        </div>
                    ))}


                </div>


            </>
            }
        </div>
    )
}