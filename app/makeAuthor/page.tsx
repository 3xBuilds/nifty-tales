"use client"
import React, { useState, useRef, useEffect } from "react"
import { ethers } from "ethers";
import abi from "@/utils/abis/templateABI"
import { bytecode } from "@/utils/bytecode/bytecode";
import { useAccount } from "wagmi";
import Navbar from "@/components/Home/Navbar";
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton";
import axios from "axios";
import Image from "next/image";
import { useGlobalContext } from "@/context/MainContext";
import { useRouter } from "next/navigation";
import { RiLoader5Line } from "react-icons/ri";
import { CiImageOn } from "react-icons/ci";
import { Loader } from "@/components/Global/Loader";
import { toast } from "react-toastify";
import { useLoading } from "@/components/PageLoader/LoadingContext";
import { AiOutlineLoading } from "react-icons/ai";

export default function Home() {

    const [collectionName, setCollectionName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const [profileImg, setProfileImg] = useState<File | null>(null);
    const [bannerImg, setBannerImg] = useState<File | null>(null);

    const { address, isDisconnected } = useAccount();
    const {user, getUser} = useGlobalContext();

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()


    async function deployContract() {
        try {
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


                await contract.deployed();
                await axios.patch(`/api/user/${user?.email}`, {contractAdd: contract.address});
                
                return true;
            }

        }
        catch (err) {
            console.error(err);
            setLoading(false);
            return false;

        }
    }

    async function handleSubmit(e: any) {
        setLoading(true);
        e.preventDefault();

        if(!address){
            toast.error("Please connect your wallet");
            setLoading(false);
            return;
        }

        if (!collectionName || !symbol || !profileImg || !bannerImg) {
            toast.error("Please fill in all fields and upload an image.");
            setLoading(false);
            return;
        }

        try {
            // Deploy the contract
            const contractAddress = await deployContract();

            // console.log("Address", contractAddress);
            //@ts-ignore
            
            if(contractAddress){
                axios.patch("/api/user/"+user?.email, {collectionName: collectionName})
    
                // Create FormData object
                const formData = new FormData();
    
                formData.append("profileImage", profileImg);
                formData.append("wallet", String(address));
    
                //@ts-ignore
                formData.append("bannerImage", bannerImg);
    
    
                // Upload to S3 using the API route
                const response = await axios.post('/api/profileCreate', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

    
                if (response.status !== 200) {
                    toast.error("An error occurred while uploading.");
                    setLoading(false);
                    return;
                }
    
                // Reset form fields
                setCollectionName("");
                setSymbol("");
                setProfileImg(null);
                if (fileInputRef.current) {
    
                    //@ts-ignore
                    fileInputRef.current.value = "";
                }
                // console.log("timeout started")
                await new Promise(resolve => setTimeout(resolve, 3000));

                if(response.status == 200){
                    getUser()
                    setIsLoading(true);
                    router.push("/authors/");
                }
            }

            else{
                toast.error("Library Creation failed!");
                setLoading(false);
            }


            // alert("Collection created successfully!");
        } catch (error) {
            toast.error("An error occurred while creating the collection. Please try again.");
            setLoading(false);
        }
    }

    const fileInputRef = useRef(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImg(e.target.files[0]);
        }
    };
    
    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setBannerImg(e.target.files[0]);
        }
    };

    useEffect(()=>{
        if(user?.contractAdd !== ""){
            setLoading(true);
            setIsLoading(true);

            router.push("/authors");
        }
    },[user])

    const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])


    return (
        <div className=" gap-10 w-screen min-h-screen md:p-10 p-4">
        
            {/* <div className="flex items-center justify-end absolute top-4 w-screen right-4">
                <Navbar/>
            </div> */}

            {loading && <div className="w-screen h-screen fixed top-0 left-0 backdrop-blur-xl flex items-center justify-center">
                    <div className="bg-white shadow-xl shadow-black/30 w-80 h-20 font-semibold flex gap-4 items-center justify-center text-xl rounded-xl"><AiOutlineLoading className="animate-spin"/>Creating your Library</div>
                </div>}

            {isDisconnected && <div className="w-screen h-screen flex items-center justify-center flex-col gap-4 bg-black/50 absolute z-50 backdrop-blur-2xl top-0 left-0">
                <WalletConnectButton/>
                <h3 className="font-semibold text-xl text-white">Connect Wallet to proceed</h3>
            </div>}

            <div className="w-full flex md:justify-start justify-center font-bold max-md:mt-16 mt-10">
                <h2 className="text-3xl">Become an Author</h2>
            </div>

            {user?.contractAdd == "" && <div className="flex max-md:flex-col">

                <div className="flex flex-col items-center h-fit justify-start md:w-[60%] md:border-r-[1px] max-md:border-b-[1px] border-dashed border-gray-300">


                    <form onSubmit={handleSubmit} className="mt-10 md:px-10 px-3 h-full w-full">

                    <div className="flex max-md:flex-col md:items-start items-center justify-center gap-4" >
                        <div className="flex flex-col items-center justify-center md:justify-start md:w-[40%]">
                            <h2 className="text-sm text-gray-400">Upload a Photo</h2>

                            <div>
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-48 h-48 border-2 border-jel-gray-3 border-dashed rounded-xl cursor-pointer hover:bg-jel-gray-1">
                                    <div className="flex flex-col items-center h-full w-full p-2 overflow-hidden justify-center rounded-lg">
                                        {!profileImg ?<div className="bg-gray-200 text-gray-400 w-full h-full flex gap-2 flex-col items-center justify-center rounded-xl" > <svg className="w-8 h-8 text-jel-gray-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg><h2 className="text-sm text-center px-2 font-semibold text-gray-400" >Upload a photo for your collection</h2></div> :
                                            <Image alt="hello" className='w-full h-full object-cover rounded-xl hover:scale-110 hover:opacity-30 duration-300' width={1000} height={1000} src={!profileImg ? "" : (profileImg instanceof File ? URL.createObjectURL(profileImg) : profileImg)} />}
                                    </div>
                                    <input id="dropzone-file" type="file" accept='image/*' onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="md:w-[60%]">
                            <div className="w-full text-start flex flex-col">
                                <input placeholder="John's Collection" onChange={(e) => { setCollectionName(e.target.value) }} value={collectionName} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                                <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Name your collection</h2>
                            </div>

                            <div className="w-full text-start flex flex-col">
                                <input placeholder="JCN" onChange={(e) => { setSymbol(e.target.value) }} value={symbol} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                                <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Collection Symbol</h2>
                            </div>

                        </div>
                    </div>

                    <div className="w-full flex items-center max-md:mt-10 justify-center">
                        <div className="flex flex-col items-center w-[42rem] justify-center mt-10 md:justify-start h-[14rem]">
                                {/* <h2 className="text-sm -translate-y-2 text-gray-400">Upload a Banner</h2> */}

                                <div className="w-full h-full" >
                                    <label htmlFor="banner-dropzone-file" className="flex rounded-xl flex-col items-center justify-center w-full h-full border-2 border-jel-gray-3 border-dashed  cursor-pointer hover:bg-jel-gray-1">
                                        <div className="flex flex-col items-center h-full w-full p-2 overflow-hidden justify-center rounded-lg">
                                            {!bannerImg ? <div className="w-full h-full bg-gray-200 rounded-xl flex flex-col items-center justify-center">
                                                    <CiImageOn className="text-2xl text-gray-400" />
                                                    <h3 className="text-sm text-gray-400 font-semibold text-center" >Upload a 1500x500 png image for best quality</h3>
                                                </div> :
                                                <Image alt="hello" className='w-full h-full object-cover rounded-lg hover:scale-110 hover:opacity-30 duration-300' width={1000} height={1000} src={!bannerImg ? "" : (bannerImg instanceof File ? URL.createObjectURL(bannerImg) : bannerImg)} />}
                                        </div>
                                        <input id="banner-dropzone-file" type="file" accept='image/*' onChange={handleBannerChange} className="hidden" />
                                    </label>
                                    {/* <button onClick={handleSubmit} disabled={uploading} className=' col-span-2 w-32 py-2 font-medium text-black rounded-xl hover:-translate-y-[0.3rem] duration-200 bg-jel-gray-3 hover:bg-jel-gray-2 text-nowrap mt-2'>{uploading ? "Uploading..." : "Upload"}</button> */}
                                </div>
                            </div>    
                    </div>

                    <div className="w-full flex items-center justify-center md:justify-end">
                        <button type="submit" className="bg-black text-white md:px-4 md:py-2 px-6 py-3 rounded-xl my-10 hover:scale-105 duration-200">Create</button>
                    </div>

                    </form>
                </div>

                <div className="md:w-[40%] md:px-10 px-3 flex items-center text-gray-400">
                    <ul className="flex flex-col gap-2 list-disc max-md:my-5">
                        <li>By becoming an author, you are giving niftytales.xyz access to your photos and pdf</li>
                        <li>You are agreeing to share a part of your earning as platform fee (0.0007 ETH per mint) </li>

                    </ul>
                </div>

            </div>}

        </div>
    )
}