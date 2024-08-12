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
import { FaPlusCircle } from "react-icons/fa";


export default function Home(){

    const pathName = usePathname();
    const {address} = useAccount();

    const router = useRouter()

    const {user} = useGlobalContext();

    const[profileImgLink, setProfileImgLink] = useState<string>("")
    const[bannerLink, setBannerLink] = useState<string>("")

    const[publishedBooks, setPublishedBooks] = useState([])
    const[draftBooks, setDraftBooks] = useState([])


    const[slicer, setSlicer] = useState<number>(4);

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
            console.log(contract?.address);
            const contractName = await contract?.name();

            console.log(contractName);

            setName(contractName);
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        if(user){
            setProfileImgLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + user.wallet + "/info/profileImage");
            setBannerLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + user.wallet + "/info/bannerImage");
            getContractDetails();

        }
    },[user])

    useEffect(()=>{
        if(user){

            var arr1:any= []
            var subArr1:any = []
            var arr2:any = []
            var subArr2:any = []


            user.yourBooks.reverse().map((item:any, i)=>{
                if(item.isPublished){
                    subArr1.push(item);
                }
                if(subArr1.length == slicer || i == user.yourBooks.length-1){
                    arr1.push(subArr1);
                    subArr1 = []
                }
                if(!item.isPublished){
                    subArr2.push(item);
                }
                if(subArr2.length == slicer || i == user.yourBooks.length-1){
                    arr2.push(subArr2);
                    subArr2 = []
                }
            })

            //@ts-ignore
            setPublishedBooks(arr1);
            //@ts-ignore
            setDraftBooks(arr2);
        }
    },[slicer, user])

    useEffect(()=>{
        const screenWidth = window.innerWidth;

        if(screenWidth > 1200){
            setSlicer(5);
        }

    },[])

    function handleDraft(item:any){
        console.log(item);
        localStorage.setItem("name", item.name);
        localStorage.setItem("price", item.price);
        localStorage.setItem("maxMint", item.maxMint);
        localStorage.setItem("cover", item.cover);
        localStorage.setItem("artist", item.artist);
        localStorage.setItem("isbn", item.ISBN);
        localStorage.setItem("description", item.description);
        localStorage.setItem("tags", JSON.stringify(item.tags));
        localStorage.setItem("pdf", item.pdf);

        router.push("/publish")
    }

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
                    <h2 className="md:text-5xl text-xl font-bold text-white">{name}</h2>
                </div>
            </div>
            

            { user && user?.yourBooks?.length == 0 ? <div className="w-screen h-[25rem] flex items-center justify-center flex-col">
                <h2 className="text-xl font-bold">Publish your first book!</h2>
                <button onClick={()=>{router.push("/publish")}} className='bg-[#000000] rounded-lg hover:-translate-y-1 duration-200 text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-52 my-2 max-md:mx-auto'>Publish</button>
            </div>: 
            <>

                {/* PUBLISHED BOOKS */}
                <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
                    <div className="flex items-center justify-center w-full ">
                        <div className="w-1/2 flex items-start justify-start ">
                            <h3 className="text-2xl font-bold ">Your Books</h3>
                        </div>
                        <div className="w-1/2 flex justify-end">
                            <button onClick={()=>{router.push("/publish")}} className='bg-[#000000] rounded-lg hover:-translate-y-1 duration-200 text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-24 my-2 max-md:mx-auto'>+ New</button>
                        </div>
                    </div>

                    {publishedBooks.map((item:any)=>(
                        <div className="w-full mb-5">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item.map((item2:any)=>(<div className="flex flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                        <h2 className="font-semibold text-sm" >{item2.name}</h2>

                            <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                                <div className="w-full h-52 overflow-hidden rounded-lg relative z-10">
                                    <Image src={item2.cover} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="w-full h-full shadow-xl shadow-black/40 absolute top-1 left-1 bg-gray-200 rounded-lg z-[9]" >
                                </div>
                            </button>
                        </div>
                        ))}
                        </div>
                            <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-black/20 relative z-10">
                            </div>
                        </div>
                    ))}


                </div>


                {/* DRAFT BOOKS */}
                <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
            <div className="w-full">
                    <h3 className="text-2xl font-bold ">Drafts</h3>
            </div>

            {draftBooks.map((item:any)=>(
                <div className="w-full mb-5">
                <div className="w-full max-md:flex max-md:flex-col max-md:gap-6 md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                {item.map((item2:any)=>(<button onClick={()=>{handleDraft(item2)}} className="flex flex-col items-center px-10 mt-2 justify-center gap-4">
                <h2 className="font-semibold text-sm" >{item2.name}</h2>

                    <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                        <div className="w-full h-52 overflow-hidden rounded-lg relative z-10">
                            <Image src={item2.cover} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="w-full h-full shadow-xl shadow-black/40 absolute top-1 left-1 bg-gray-200 rounded-lg z-[9]" >
                        </div>
                    </button>
                </button>
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