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

export default function Home(){

    const pathName = usePathname();
    const {address} = useAccount();

    const router = useRouter()

    const {user} = useGlobalContext();

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
                console.log(user, user?.contractAdd);
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

            console.log(contractName);

            setName(contractName);
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        if(address){
            setProfileImgLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + address + "/info/profileImage");
            setBannerLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + address + "/info/bannerImage");
            getContractDetails();
        }
    },[user])

    return(
        <div className="">
            <div className="h-16 w-screen">
                <Navbar/>
            </div>
            <div className="w-screen relative h-[10rem] md:h-[22rem] max-md:flex items-center justify-center overflow-hidden object-fill ">
                <div className="w-screen absolute h-full overflow-hidden">
                    <Image width={1080} height={1080} src={bannerLink} alt="dp" className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 brightness-50 -translate-y-1/2"/>
                </div>
                <div className="flex gap-8 object-center items-center h-full justify-center my-auto max-md:w-[90%] absolute z-50  md:left-10">
                    <Image width={1080} height={1080} src={profileImgLink} alt="dp" className="md:w-[10rem] md:h-[10rem] h-[6rem] w-[6rem] border-4 border-white rounded-full" />
                    <h2 className="md:text-5xl text-xl font-bold text-white">{name}</h2>
                </div>
            </div>

            <div className="w-screen h-[25rem] flex items-center justify-center flex-col">
                <h2 className="text-xl font-bold">Publish your first book!</h2>
                <button onClick={()=>{router.push("/publish")}} className='bg-[#000000] rounded-lg hover:-translate-y-1 duration-200 text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-52 my-2 max-md:mx-auto'>Publish</button>
            </div>
        </div>
    )
}