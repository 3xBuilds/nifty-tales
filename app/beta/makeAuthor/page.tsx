"use client"
import React , {useState} from "react"
import { ethers } from "ethers";
import abi from "@/utils/abis/templateABI"
import { bytecode } from "@/utils/bytecode/bytecode";
import { useAccount } from "wagmi";
import Navbar from "@/components/Home/Navbar";
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton";

export default function Home(){

    const[collectionName, setCollectionName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const {address} = useAccount();

    async function deployContract() {
        try{
            console.log(address)
            //@ts-ignore
            if (typeof window.ethereum !== 'undefined') {
    
            //@ts-ignore
              await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            //@ts-ignore
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();
              
              const factory = new ethers.ContractFactory(abi, bytecode, signer);
              const contract = await factory.deploy(collectionName, symbol, "");
              
              await contract.deployed();
              console.log('Contract deployed to:', contract.address);
              return contract.address;
            }

        }
        catch(err){
            console.log(err);
        }
      }


    return(
        <div className="flex flex-col items-center justify-start w-screen min-h-screen p-10">
            <WalletConnectButton/>
            <h2 className="text-sm">Collection Name</h2>
            <input onChange={(e)=>{setCollectionName(e.target.value)}} value={collectionName} className="p-2 rounded-xl border-2 border-black" ></input>

            <h2 className="text-sm mt-5">Collection Symbol</h2>
            <input onChange={(e)=>{setSymbol(e.target.value)}} value={symbol} className="p-2 rounded-xl border-2 border-black" ></input>

            <button onClick={deployContract} className="bg-black text-white px-4 py-2 rounded-xl my-10 hover:scale-105 duration-200" >Create</button>
        </div>
    )
}