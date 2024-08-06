"use client"
import React, { useState, useRef } from "react"
import { ethers } from "ethers";
import abi from "@/utils/abis/templateABI"
import { bytecode } from "@/utils/bytecode/bytecode";
import { useAccount } from "wagmi";
import Navbar from "@/components/Home/Navbar";
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton";
import axios from "axios";
import Image from "next/image";

export default function Home() {

    const [collectionName, setCollectionName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const [profileImg, setProfileImg] = useState<File | null>(null);
    let { address } = useAccount();


    async function deployContract() {
        try {
            console.log(address)
            //@ts-ignore
            if (typeof window.ethereum !== 'undefined') {

                //@ts-ignore
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                //@ts-ignore
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const uri = "https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + address + "/metadata/";

                const factory = new ethers.ContractFactory(abi, bytecode, signer);
                const contract = await factory.deploy(collectionName, symbol, uri);


                const res = await contract.deployed();
                console.log("HELLO I AM RES",res);
                
                return contract.address;
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    async function handleSubmit(e: any) {
        e.preventDefault();

        if (!collectionName || !symbol || !profileImg) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        try {
            // Deploy the contract
            const contractAddress = await deployContract();

            if (!contractAddress) {
                throw new Error("Contract deployment failed");
            }

            // Create FormData object
            const formData = new FormData();

            formData.append("profileImage", profileImg);
            formData.append("wallet", String(address));



            // Upload to S3 using the API route
            const response = await axios.post('/api/profileCreate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status !== 200) {
                throw new Error('Upload failed');
            }

            // Reset form fields
            setCollectionName("");
            setSymbol("");
            setProfileImg(null);
            if (fileInputRef.current) {

                //@ts-ignore
                fileInputRef.current.value = "";
            }

            // alert("Collection created successfully!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while creating the collection. Please try again.");
        }
    }

    const fileInputRef = useRef(null);

    const handleClick = () => {

        //@ts-ignore
        fileInputRef.current.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImg(e.target.files[0]);
        }
    };


    return (
        <div className=" gap-10 w-screen min-h-screen md:p-10 p-4">
            <div className="flex items-center justify-end absolute top-4 w-screen right-4">
                <WalletConnectButton />
            </div>

            <div className="w-full flex md:justify-start justify-center font-bold max-md:mt-16 mt-10">
                <h2 className="text-3xl">Become an Author</h2>
            </div>

            <div className="flex max-md:flex-col">

                <div className="flex flex-col items-center h-fit justify-start md:w-[60%] md:border-r-[1px] max-md:border-b-[1px] border-dashed border-gray-300">


                    <form onSubmit={handleSubmit} className="mt-10 px-10 flex max-md:flex-col md:items-start items-center justify-center gap-4 h-full w-full">


                        <div className="flex flex-col items-center justify-center md:justify-start md:w-[40%]">
                            <h2 className="text-sm">Upload a Photo</h2>

                            <div>
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-48 h-48 border-2 border-jel-gray-3 border-dashed rounded-full cursor-pointer hover:bg-jel-gray-1">
                                    <div className="flex flex-col items-center h-full w-full p-2 overflow-hidden justify-center rounded-lg">
                                        {!profileImg ? <svg className="w-8 h-8 text-jel-gray-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg> :
                                            <Image alt="hello" className='w-full h-full object-cover rounded-full hover:scale-110 hover:opacity-30 duration-300' width={1000} height={1000} src={!profileImg ? "" : (profileImg instanceof File ? URL.createObjectURL(profileImg) : profileImg)} />}
                                    </div>
                                    <input id="dropzone-file" type="file" accept='image/*' onChange={handleFileChange} className="hidden" />
                                </label>
                                {/* <button onClick={handleSubmit} disabled={uploading} className=' col-span-2 w-32 py-2 font-medium text-black rounded-xl hover:-translate-y-[0.3rem] duration-200 bg-jel-gray-3 hover:bg-jel-gray-2 text-nowrap mt-2'>{uploading ? "Uploading..." : "Upload"}</button> */}
                            </div>
                        </div>

                        <div className="md:w-[60%]">
                            <div className="w-full">
                                <h2 className="text-sm">Library Name</h2>
                                <input onChange={(e) => { setCollectionName(e.target.value) }} value={collectionName} className="p-2 rounded-xl w-full border-2 border-black" ></input>
                            </div>

                            <div className="w-full">
                                <h2 className="text-sm mt-5">Library Symbol</h2>
                                <input onChange={(e) => { setSymbol(e.target.value) }} value={symbol} className="p-2 w-full rounded-xl border-2 border-black" ></input>
                            </div>

                            <div className="w-full flex items-center justify-center md:justify-end">
                                <button type="submit" className="bg-black text-white md:px-4 md:py-2 px-6 py-3 rounded-xl my-10 hover:scale-105 duration-200">Create</button>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="md:w-[40%] px-10 flex items-center text-gray-400">
                    <ul className="flex flex-col gap-2 list-disc max-md:my-5">
                        <li>By becoming an author, you are giving niftytales.xyz lmao</li>
                        <li>You are agreeing to share a part of your earning as platform fee (0.0007 ETH per mint) </li>

                    </ul>
                </div>

            </div>

        </div>
    )
}