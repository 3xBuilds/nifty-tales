"use client"

import { useGlobalContext } from "@/context/MainContext";
import axios from "axios";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import abi from "@/utils/abis/templateABI"
import { RiLoader5Fill } from "react-icons/ri";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

export default function Home(){

    const {data:session} = useSession();
    const {user, night} = useGlobalContext();

    const[reportedArr, setReportedArr] = useState([]);
    const [authorArr, setAuthorArr] = useState([])
    const router = useRouter()
    const[loading, setLoading] = useState(false);

    async function contractSetup(add:string) {
        try {
            //@ts-ignore
            if (typeof window.ethereum !== 'undefined') {

                //@ts-ignore
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                console.log(add);
                //@ts-ignore
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                //@ts-ignore
                const contract = new ethers.Contract(add, abi, signer);
                return contract;

            }

        }
        catch (err) {
            console.error(err);
        }
    }

    async function fetchReported(){
        try{
            await axios.get("/api/admin/reportedBooks").then((res)=>{
                setReportedArr(res.data.array);
                // console.log(res.data.array);
            })
        }
        catch(err){
            console.log(err);
        }
    }

    async function fetchAuthors(){
        try{
            await axios.get("/api/admin/getAuthors").then((res)=>{
                setAuthorArr(res.data.array);
                // console.log(res.data.array);
            })
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchReported();
        fetchAuthors()
    },[])

    async function pauseMint(tokenId:number, id:string, contractAdd:string){
        try{
            setLoading(true);
            const contract = await contractSetup(contractAdd);

            const gasEstimate = await contract?.estimateGas.pauseMint(tokenId).catch((err) => { console.log(err) });
                console.log("hello2", gasEstimate);
                // Add a 20% buffer to the gas estimate
                const gasLimit = gasEstimate?.mul(130).div(100);

                // Get current gas price
                const gasPrice = await contract?.provider.getGasPrice();

            const txn = await contract?.pauseMint(tokenId, {
                gasLimit: gasLimit,
                gasPrice: gasPrice
            });

            await txn.wait();

            if(txn){
                await axios.patch("/api/book/"+id,{isPaused: true}).then((res)=>{
                    toast.success("Mint paused for the book!");
                    setLoading(false)
                    disable(id)
                });
            }
        }
        catch(err){
            console.log(err);
            setLoading(false)
            toast.error("Error while pausing mint.");
        }
    }

    async function unpauseMint(tokenId:number, id:string, contractAdd:string){
        try{
            setLoading(true);

            const contract = await contractSetup(contractAdd);

            const gasEstimate = await contract?.estimateGas.unpauseMint(tokenId).catch((err) => { console.log(err) });
                console.log("hello2", gasEstimate);
                // Add a 20% buffer to the gas estimate
                const gasLimit = gasEstimate?.mul(130).div(100);

                // Get current gas price
                const gasPrice = await contract?.provider.getGasPrice();

            const txn = await contract?.unpauseMint(tokenId, {
                gasLimit: gasLimit,
                gasPrice: gasPrice
            });

            await txn.wait();

            if(txn){
                await axios.patch("/api/book/"+id,{isPaused: false}).then((res)=>{
                    toast.success("Mint un-paused for the book!");
                    setLoading(false);
                    enable(id);
                });
            }
        }
        catch(err){
            console.log(err);
            toast.error("Error while un-pausing mint.");
            setLoading(false);

        }
    }

    async function enable(id:string){
        try{
            await axios.patch("/api/book/"+id, {isAdminRemoved: false}).then((res)=>{
                toast.success("Book Enabled");
                fetchReported();
                setLoading(false);

            });
        }
        catch(err){
            console.log(err);
            toast.error("Couldn't enable.")
            setLoading(false);

        }
    }

    async function disable(id:string){
        try{
            await axios.patch("/api/book/"+id, {isAdminRemoved: true}).then((res)=>{
                toast.success("Book Disabled");
                fetchReported()
                setLoading(false);
            });
        }
        catch(err){
            console.log(err);
            toast.error("Couldn't disable.")
            setLoading(false);

        }
    }

    if(session && user?.role == "ADMIN")
    return(
        <div className={`md:px-10 px-4 mt-20 ${night ? "bg-[#212121]" : "bg-white"} `}>
            <h2 className="text-2xl font-bold" >Admin Dashboard</h2>
            {reportedArr?.length > 0 && <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
                <h2 className="text-2xl font-bold">Reports</h2>
                <div className='w-full max-w-full overflow-x-auto mx-auto my-10'>
                    <div className='overflow-x-auto '>
                        <div className='min-w-[800px] w-[100%]'> {/* Set a minimum width for the table */}
                            <div className=''>
                                <div className='flex text-center py-2 border-[1px] rounded-t-xl border-gray-300 text-black'>
                                    <div className='flex-shrink-0 min-w-32 w-[15%] font-medium text-md text-nifty-gray-1'>
                                        <h2>ID</h2>
                                    </div>
                                    <div className='flex-shrink-0 min-w-32 w-[15%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Book</h2>
                                    </div>
                                    <div className='flex-shrink-0 min-w-32 w-[15%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Reports</h2>
                                    </div>
                                    <div className='flex-shrink-0 min-w-32 w-[40%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Reason</h2>
                                    </div>
                                    <div className='flex-shrink-0 min-w-32 w-[15%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Action</h2>
                                    </div>
                                    {/* <div className='flex-shrink-0 min-w-32 w-[25%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Contact</h2>
                                    </div> */}
                                </div>

                                <div className="flex flex-col w-full justify-center items-center">
                                    {reportedArr.map((item, i) => (
                                        <div className={`flex w-full text-center border-gray-300 h-12 border-b-[1px] border-x-[1px] ${i+1 == reportedArr.length && "rounded-b-xl"} items-center justify-center`}>
                                            <div className='flex-shrink-0 min-w-32 w-[15%] font-medium text-md text-black'>
                                                <h2>{i+1}</h2>
                                            </div>
                                            <div className='flex-shrink-0 min-w-32 w-[15%] font-medium text-md text-black'>
                                                {/* @ts-ignore */}
                                                <button className="hover:underline duration-200" onClick={()=>{router.push("/books/"+item.id)}} >{item.name.slice(0,10)}{item.name.length > 10 && "..."}</button>
                                            </div>
                                            <div className='flex-shrink-0 min-w-32 w-[15%] font-medium text-md text-black'>
                                                {/* @ts-ignore */}
                                                <h2>{item.reportNum}</h2>
                                            </div>
                                            <div className='flex-shrink-0 min-w-32 w-[40%] flex items-center justify-center font-medium text-xs text-black'>
                                                {/* @ts-ignore */}
                                                {item.tagsArr.map((item2)=>(
                                                    <div className={`py-2 w-24 px-2 hover:scale-105 duration-200 hover:brightness-105 rounded-xl flex gap-2 items-center justify-center bg-gray-200 border-2 border-gray-400 font-semibold text-center text-gray-400 text-[0.6rem]`}>
                                                        {item2}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='flex-shrink-0 min-w-32 w-[15%] font-medium text-md text-black'>
                                                {/* @ts-ignore */}
                                                {!item.status ? <button className='text-sm font-bold text-black bg-gray-300 py-1 w-24 rounded-md' onClick={()=>{pauseMint(item.tokenId, item.id, item.contractAdd)}} >{loading ? <RiLoader5Fill className="animate-spin text-xl mx-auto"/> : "Disable"}</button> : <button className='text-sm font-bold text-black bg-gray-300 py-1 w-24 rounded-md' onClick={()=>{unpauseMint(item.tokenId, item.id, item.contractAdd)}} >{loading ? <RiLoader5Fill className="animate-spin text-xl mx-auto"/> : "Enable"}</button>}
                                            </div>
                                            {/* <div className='flex-shrink-0 flex items-center justify-center min-w-32 w-[25%] font-medium text-md text-black'>
                                                <a href="https://www.3xbuilds.com" target="_blank" ><FaDiscord></FaDiscord></a>
                                            </div> */}
                                            
                                        </div>
                                    ))}
                                </div>

                            </div>


                        </div>
                    </div>
                </div>
                
            </div>}

            <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
                <h2 className="text-2xl font-bold">Users</h2>

                {authorArr &&
                    <div className='w-full max-w-full overflow-x-auto mx-auto my-10'>
                    <div className='overflow-x-auto '>
                        <div className='min-w-[800px] w-[100%]'>
                            <div className=''>
                                <div className='flex text-center py-2 border-[1px] rounded-t-xl border-gray-300 text-black'>
                                    <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-nifty-gray-1'>
                                        <h2>ID</h2>
                                    </div>
                                    <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Name</h2>
                                    </div>
                                    <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Collection</h2>
                                    </div>
                                    <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Email</h2>
                                    </div>
                                    <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Books</h2>
                                    </div>
                                    {/* <div className='flex-shrink-0 min-w-32 w-[25%] font-medium text-md text-nifty-gray-1'>
                                        <h2>Contact</h2>
                                    </div> */}
                                </div>

                                <div className="flex flex-col w-full justify-center items-center">
                                    {authorArr.map((item:UserType, i) => (
                                        <div className={`flex w-full text-center border-gray-300 h-12 border-b-[1px] border-x-[1px] ${i+1 == reportedArr.length && "rounded-b-xl"} items-center justify-center`}>
                                            <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-black'>
                                                <h2>{i+1}</h2>
                                            </div>
                                            <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-black'>
                                                {/* @ts-ignore */}
                                                <h2 >{item?.username.slice(0,10)}{item?.username.length > 10 && "..."}</h2>
                                            </div>
                                            <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-black'>
                                                {/* @ts-ignore */}
                                                <button className="hover:underline duration-200" onClick={()=>{router.push("/authors/"+item?.wallet)}} >{item?.collectionName}</button>
                                            </div>
                                            <div className='flex-shrink-0 min-w-32 w-[20%] flex items-center justify-center font-medium text-xs text-black'>
                                                {/* @ts-ignore */}
                                                <h2>{item?.email}</h2>
                                            </div>
                                            <div className='flex-shrink-0 min-w-32 w-[20%] font-medium text-md text-black'>
                                                {/* @ts-ignore */}
                                                <h2>{item?.yourBooks?.length}</h2>
                                            </div>
                                            {/* <div className='flex-shrink-0 flex items-center justify-center min-w-32 w-[25%] font-medium text-md text-black'>
                                                <a href="https://www.3xbuilds.com" target="_blank" ><FaDiscord></FaDiscord></a>
                                            </div> */}
                                            
                                        </div>
                                    ))}
                                </div>

                            </div>


                        </div>
                    </div>
                </div>
                
                }
            </div>
        </div>
    )
}