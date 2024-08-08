"use client"

import { usePathname } from "next/navigation"
import { ethers } from "ethers";
import abi from "@/utils/abis/templateABI"
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton";

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
        <div>
            <WalletConnectButton/>
            <Image width={1080} height={1080} src={bucketLink} alt="dp" className="w-20 h-20 rounded-full" />
            <h2 className="text-5xl font-bold">{name}</h2>
        </div>
    )
}