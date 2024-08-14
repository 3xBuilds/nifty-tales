"use client"

import { usePathname } from 'next/navigation'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Home/Navbar';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import abi from "@/utils/abis/templateABI"
import { ImArrowLeft } from 'react-icons/im';
import { IoIosArrowBack } from 'react-icons/io';
import { Loader } from '@/components/Global/Loader';
import { RecommendedFetcher } from '@/components/fetcher/recommendedFetcher';
import { useGlobalContext } from '@/context/MainContext';

type BookType = {
  name: string;
  isPublished?: boolean;
  price?: number;
  tokenId: number;
  contractAddress: string;
  maxMint?: number;
  cover?: string | null;
  author: Object | null;
  artist?: string | null;
  minted?: number;
  ISBN?: string | null;
  description?: string | null;
  tags?: string[];
  pdf: string;
  readers?: number;
  isBoosted?: string | null;
  createdAt?: Date;
}
 
export default function Page() {
    const pathname = usePathname();

    const[bookDetails, setBookDetails] = useState<BookType>();

    const{fetch, setFetch} = useGlobalContext();

    const[amount, setAmount] = useState(0);
    const[showModal, setShowModal] = useState(false);

    const[loading, setLoading] = useState(false);

    const router = useRouter()

    async function getBookDetails(){
      try{
        await axios.get("/api/book/"+pathname.split("/")[2]).then((res)=>{
          console.log("REFETCHED BOOK ASSHOLE", res.data.data);
          setBookDetails(res.data.data);
        });
      }
      catch(err){
        console.log(err);
      }
    }



    async function contractSetup(){
      try {
          //@ts-ignore
          if (typeof window.ethereum !== 'undefined') {

              //@ts-ignore
              await window.ethereum.request({ method: 'eth_requestAccounts' });

              //@ts-ignore
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();

              console.log(bookDetails?.contractAddress)
              //@ts-ignore
              const contract = new ethers.Contract(bookDetails?.contractAddress, abi, signer);

          return contract;

          }

      }
      catch (err) {
        setLoading(false);

          console.error(err);
      }
  }

    async function mint(){
      try{
        const contract = await contractSetup();
        console.log(contract);
        const txn = await contract?.mint(amount, bookDetails?.tokenId, {value: ethers.utils.parseEther(String(bookDetails?.price))});

        txn.wait().then(async(res:any)=>{
          console.log(res);
          //@ts-ignore
          await axios.patch("/api/book/"+pathname.split("/")[2], {minted: bookDetails?.minted+amount}).then((res)=>{
            setFetch((prev)=>(!prev));
            setLoading(false);
          })
        })
      }
      catch(err){
        setLoading(false);
        console.log(err);
      }
    }

    useEffect(()=>{
      getBookDetails();
    },[ , fetch])

    

    return (
    <div className=''>
        <div className="h-16 w-screen relative z-[100000]">
            <Navbar/>
        </div>

        {loading && <Loader/>}

      <div className={`fixed h-screen w-screen backdrop-blur-xl duration-500 ${showModal ? "translate-y-0 opacity-100" : "-translate-y-[400rem] opacity-0"} top-0 left-0 flex flex-col z-[10000] items-center justify-center`}>
          <div className='bg-white rounded-xl h-40 flex flex-col gap-4 justify-center items-center px-10'>
            <div className='flex rounded-xl items-center justify-center gap-4 ' >
              <button onClick={()=>{
                if(amount != 0){
                  setAmount((prev)=>(prev-1))
                }
              }} className='hover:scale-105 duration-200' ><IoIosArrowBack className='text-2xl text-black'/></button>
              <h3 className='text-2xl font-bold'>{amount}</h3>
              <button onClick={()=>{
                if(bookDetails?.maxMint == 0 || bookDetails?.minted as number+amount != bookDetails?.maxMint){
                  setAmount((prev)=>(prev+1))
                }
                else{
                  setAmount((prev)=>(prev))
                }
              }} className='hover:scale-105 duration-200'><IoIosArrowBack className='text-2xl text-black rotate-180'/></button>
            </div>
            <div className='flex gap-2 items-center justify-center' >
                <button onClick={()=>{setShowModal(false)}} className='text-black bg-gray-200 h-10 w-32 font-bold rounded-lg hover:-translate-y-1 px-3 py-1 transform transition duration-200 ease-in-out flex items-center justify-center flex-col gap-0' >Cancel</button>
                <button onClick={()=>{ setLoading(true); setShowModal(false); mint()}} className='w-32 h-10 py-1 px-3 flex items-center justify-center rounded-lg text-white font-bold hover:-translate-y-1 duration-200 bg-black' >Mint</button>
            </div>
          </div>
      </div>

        <div className="w-screen relative h-[40rem] md:h-[22rem] flex items-center justify-center overflow-hidden object-fill ">
          <div className='absolute top-0 bg-white/10 px-4 py-2 z-[1000] text-white font-semibold max-md:rounded-b-xl md:right-0 rounded-bl-xl border-b-[1px] md:border-l-[1px] border-white' >Minted: {bookDetails?.minted ? bookDetails.minted : 0}{bookDetails?.maxMint != 0 && "/"+bookDetails?.maxMint}</div>
            <div className="w-screen absolute h-full overflow-hidden">
                <Image width={1080} height={1080} src={bookDetails?.cover || ""} alt="dp" className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 brightness-75 -translate-y-1/2"/>
            </div>

            <div className='flex max-md:flex-col gap-8 object-center items-center max-md:py-10 md:h-full h-fit md:px-10 w-screen justify-center md:justify-start my-auto absolute z-50 backdrop-blur-xl'>
              <div className="flex object-center items-center md:h-full md:px-10 md:w-60 h-full justify-center md:justify-start my-auto">

                  <div className="w-48 max-md:w-32 max-md:h-48 relative md:absolute h-64">
                      <Image width={1080} height={1080} src={bookDetails?.cover || ""} alt="dp" className="shadow-xl shadow-black/20 w-full h-full z-10 object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                      <div className='w-full h-full bg-white absolute top-1 left-1 z-[9] shadow-xl shadow-black/20' ></div>
                      <div className='w-full h-full bg-white absolute top-2 left-2 z-[8] shadow-xl shadow-black/20' ></div>
                  </div>

              </div>
              <div className='flex flex-col gap-8 md:w-[50%] max-md:w-[90%] '>
                <h3 className='text-3xl text-white font-bold' >{bookDetails?.name}</h3>
                <p className='text-sm text-white' >{bookDetails?.description?.substring(0,200)}</p>
                <div className='flex flex-wrap gap-2'>
                  {bookDetails?.tags?.map((item)=>(
                    <div className='min-w-20 px-2 py-2 bg-white/10 flex items-center justify-center text-white text-sm font-semibold border-[1px] border-white rounded-lg'>
                      {item}
                    </div>
                  ))}
                </div>
                <div className='flex gap-4'>
                    <a target='_blank' className='w-32 h-10 py-1 px-3 flex items-center justify-center rounded-lg text-white font-bold hover:-translate-y-1 duration-200 bg-black' href={bookDetails?.pdf}>Read</a>
                    <button onClick={()=>{setShowModal(true)}} className='text-black bg-gray-200 h-10 w-32 font-bold rounded-lg hover:-translate-y-1 px-3 py-1 transform transition duration-200 ease-in-out flex items-center justify-center flex-col gap-0' >Mint</button>

                </div>
              </div>
            </div>
        </div>

        <RecommendedFetcher/>
    </div>
  )
}