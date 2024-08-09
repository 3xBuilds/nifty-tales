"use client"

import { usePathname } from "next/navigation"
import { ethers } from "ethers";
import abi from "@/utils/abis/templateABI"
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton";
import Navbar from "@/components/Home/Navbar";

export default function Home(){

    const pathName = usePathname();
    const {address} = useAccount();

    const[bucketLink, setBucketLink] = useState<string>("")
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

                const contract = new ethers.Contract(pathName.split("/")[2], abi, signer);

            return contract;

            }

        }
        catch (err) {
            console.log(err);
        }
    }

    async function getContractDetails(){
        try{
            const contract = await contractSetup();
            const contractName = await contract?.name();

            setName(contractName);
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        if(address){

            setBucketLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + address + "/info/profileImage");
            console.log(address)
            getContractDetails();
        }
    },[address])

    return(
        <div className="">
            <Navbar/>
            <div className="w-screen h-[20rem] overflow-hidden object-fill mt-16 relative">
                <Image width={1080} height={1080} src={bucketLink} alt="dp" className="w-[150vw] absolute blur-xl translate-y-[-40rem] rounded-full" />
                <div className="flex gap-4 items-center absolute z-50 top-[4.5rem] left-10">
                    <Image width={1080} height={1080} src={bucketLink} alt="dp" className="w-[10rem] h-[10rem] border-4 border-white rounded-full" />
                    <h2 className="text-5xl font-bold text-white">{name}</h2>
                </div>
            </div>

            <div className="w-screen h-[25rem] flex items-center justify-center flex-col">
                <h2 className="text-xl font-bold">Publish your first book!</h2>
                <button className='bg-[#000000] rounded-lg hover:-translate-y-1 duration-200 text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-52 my-2 max-md:mx-auto'>Publish</button>
            </div>
        </div>
    )
}