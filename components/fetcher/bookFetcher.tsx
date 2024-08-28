"use client"

import { usePathname } from 'next/navigation'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import abi from "@/utils/abis/templateABI"
import { RecommendedFetcher } from '@/components/fetcher/recommendedFetcher';
import { useGlobalContext } from '@/context/MainContext';
import { FaBookOpen, FaLocationArrow } from 'react-icons/fa';
import Book from '@/components/Global/Book';
import { useSession } from 'next-auth/react';
import { TiMinus, TiPlus } from 'react-icons/ti';
import { AiOutlineLoading } from 'react-icons/ai';
import Icon from '@/components/Global/Icon';
import { toast } from 'react-toastify';
import { MdLibraryAddCheck } from 'react-icons/md';
import { useLoading } from '@/components/PageLoader/LoadingContext';
import { SiOpensea } from "react-icons/si";

export const BookFetcher = () => {
    const pathname = usePathname();
    
    const router = useRouter()

    const [readListed, setReadListed] = useState<boolean>(false);
    const[bookDetails, setBookDetails] = useState<BookType>();
    const[price, setPrice] = useState<string>("0");
    const{user, getUser} = useGlobalContext();
    const [userDetails, setUserDetails] = useState<UserType>()
    const[amount, setAmount] = useState(0);
    const[showModal, setShowModal] = useState(false);
    const[loading, setLoading] = useState(false);
    const [ethPrice, setEthPrice] = useState(0);

    async function getBookDetails(){
      try{
        await axios.get("/api/book/"+pathname.split("/")[2]).then((res)=>{
          // console.log("REFETCHED BOOK ASSHOLE", res.data.data);
          setBookDetails(res.data.data);
          setUserDetails(res.data.user);
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

              // console.log(bookDetails?.contractAddress)
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

  const{data:session} = useSession()

    async function mint(){
      try{
        const contract = await contractSetup();
        // console.log(contract);
        // console.log(bookDetails);
        // console.log("txn made")
  
        // console.log(Number(ethers.utils.parseEther(String((bookDetails?.price as number + 0.0007) * amount))));
        const txn = await contract?.mint(amount, bookDetails?.tokenId, {value: ethers.utils.parseEther(String((bookDetails?.price as number + 0.0007) * amount))});
        txn.wait().then(async(res:any)=>{
          // console.log(pathname.split("/")[2], user?._id)
          await axios.post("/api/transaction/create", {txnHash: res.transactionHash, bookId: pathname.split("/")[2], userId: user?._id, value: bookDetails?.price as number*amount}).then(async(res)=>{
            // console.log("TXN CREATE RES", res);
            getBookDetails()
            setShowModal(false); 
            setLoading(false);

            //@ts-ignore
            axios.patch("/api/book/"+pathname.split("/")[2], {minted : bookDetails?.minted+amount});
          }).catch((err)=>{
            console.log(err);
          })

            getBookDetails()
            setShowModal(false); 
            setLoading(false);

          
        })
      }
      catch(err){
        setLoading(false);
        console.log(err);
      }
    }

    useEffect(()=>{
      getBookDetails();
    },[])

    async function setMintPrice(){
      try{
        const contract = await contractSetup();

        const price = await contract?.tokenIdPrice(bookDetails?.tokenId);
        // console.log(ethers.utils.formatEther(String(price)));
        setPrice(ethers.utils.formatEther(String(price)));
      }
      catch(err){
        console.log(err);
      }
    }

    async function fetchHolders(){
      try{
        const contract = await contractSetup()
      }
      catch(err){
        console.log(err);
      }
    }

    const readlist = async (id:string) => {
      try{
          await axios.post("/api/readlist", {email: session?.user?.email, bookId:id}).then((res)=>{
              // console.log(res.data.user, res.data.book);
              toast.success("Added to Readlist!");
              getUser();
              getBookDetails()
          });
      }
      catch(err){
          console.log(err);
      }
  }

  useEffect(()=>{
    user?.readlist.map((item:any)=>{
      if(item._id == bookDetails?._id){
        setReadListed(true);
      }
    })
  },[user, bookDetails])

    useEffect(()=>{
      if(bookDetails)
      setMintPrice();
    },[bookDetails])

    const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])

  function setLocalStorage(){
    localStorage.setItem('address', userDetails?.wallet as string);
    localStorage.setItem('id', String(bookDetails?.tokenId))
    localStorage.setItem('bookId', String(bookDetails?._id));
    setIsLoading(true);

    router.push("/read")
  }

  const getTickerPrice = async () => {
    try{
        const priceFetch = await fetch(`https://api.binance.us/api/v3/ticker/price?symbol=ETHUSDT`);
        const priceBody = await priceFetch.json();
        setEthPrice(Math.round(priceBody.price));
    }catch(error){
        console.error("Error", error);
        throw error;
    }
}

    useEffect(()=>{
      getTickerPrice()
    },[])

  async function tokenChecker() {
    try {
      const res = await axios.get("/api/tokenChecker");
      // console.log(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/connect');
      } else {
        console.error("An error occurred:", error);
      }
    }
  }

  useEffect(() => {
    tokenChecker();
  }, []);

    return (
      <>
    <div className=''>
        {/* <div className="h-16 w-screen relative z-[1000]">
            <Navbar/>
        </div> */}


      {/* MINTING MODAL */}
      <div className={`fixed h-screen w-screen backdrop-blur-xl duration-500 ${showModal ? "translate-y-0 opacity-100" : "-translate-y-[400rem] opacity-0"} top-0 left-0 flex flex-col z-[10000] items-center justify-center`}>
          <div className='bg-white rounded-xl flex flex-col shadow-xl shadow-black/30 gap-4 justify-center items-start p-5'>
            <h2 className='text-2xl font-bold' >Mint</h2>
            <h2 className='text-lg text-nifty-gray-1' >Choose number of mints</h2>

            <div className='flex rounded-xl items-center justify-center gap-4 w-full h-28 border-[1px] border-gray-300' >
              <button onClick={()=>{
                if(amount != 0){
                  setAmount((prev)=>(prev-1))
                }
              }} className='hover:scale-105 duration-200' ><TiMinus className='text-2xl text-black'/></button>
              <h3 className='text-2xl font-bold w-24 text-center'>{amount}</h3>
              <button onClick={()=>{
                if(bookDetails?.maxMint == 0 || bookDetails?.minted as number+amount != bookDetails?.maxMint){
                  setAmount((prev)=>(prev+1))
                }
                else{
                  setAmount((prev)=>(prev))
                }
              }} className='hover:scale-105 duration-200'><TiPlus className='text-2xl text-black rotate-180'/></button>
            </div>
            <div className='text-nifty-gray-1 w-full'>
              <div className='w-full flex'>
                <h2 className='w-1/3 text-[0.85rem]'>Book Price</h2>
                <h2 className='w-2/3 text-[0.85rem] font-semibold text-end text-nowrap'>{(Number(price)*amount).toFixed(4)} ETH (${(amount*ethPrice*Number(price)).toFixed(2)})</h2>
              </div>
              <div className='w-full flex my-2'>
                <h2 className='w-1/2 text-[0.7rem]'>Platform Fee</h2>
                <h2 className='w-1/2 text-[0.7rem] font-semibold text-end'>{(0.0007*amount).toFixed(4)} ETH (${(amount*ethPrice*0.0007).toFixed(2)})</h2>
              </div>

              <div className='w-full text-black font-bold flex mb-2 mt-4'>
                <h2 className='w-1/2 text-[0.85rem] font-bold'>Total</h2>
                <h2 className='w-1/2 text-[0.85rem] font-bold text-end text-nowrap'>{((0.0007+Number(price))*amount).toFixed(4)} ETH (${(amount*ethPrice*(0.0007+Number(price))).toFixed(2)})</h2>
              </div>
            </div>
            <div className='flex gap-2 items-center flex-col justify-center w-full' >
                <button disabled={loading} onClick={()=>{ setLoading(true); mint()}} className='w-64 h-12 py-1 px-3 flex items-center justify-center rounded-lg text-white font-bold hover:-translate-y-1 duration-200 bg-black' >{loading ? <div className='flex items-center justify-center gap-4' ><AiOutlineLoading className='text-white text-xl animate-spin' /> <h2>Collecting</h2></div>: "Collect"}</button>
                <button onClick={()=>{setLoading(false); setShowModal(false)}} className='text-black bg-gray-200 h-12 w-64 font-bold rounded-lg hover:-translate-y-1 px-3 py-1 transform transition duration-200 ease-in-out flex items-center justify-center flex-col gap-0' >Cancel</button>
            </div>
          </div>
      </div>



        <div className="w-screen relative h-[40rem] md:h-[22rem] flex items-center justify-center overflow-hidden object-fill ">
          <div className='absolute flex gap-2 items-center justify-center top-0 bg-white/10 px-4 py-2 z-[100] text-white font-semibold max-md:rounded-b-xl md:right-0 rounded-bl-xl border-b-[1px] md:border-l-[1px] border-white' >
            <span className='border-r-[1px] pr-2 border-white text-white'>Readers: {bookDetails?.readers}</span>
            <h2>Minted: {bookDetails?.minted ? bookDetails.minted : 0}{bookDetails?.maxMint != 0 && "/"+bookDetails?.maxMint}</h2>
            </div>
            <div className="w-screen absolute h-full overflow-hidden">
                <Image width={1080} height={1080} src={bookDetails?.cover || ""} alt="dp" className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 brightness-75 -translate-y-1/2"/>
            </div>

            <div className='flex max-md:flex-col gap-8 object-center items-center max-md:py-10 md:h-full h-full md:px-10 w-screen justify-center md:justify-start my-auto absolute z-50 backdrop-blur-xl'>
              <div className="flex object-center items-center md:h-full md:px-10 md:w-60 h-full justify-center md:justify-start my-auto">
                  <Book img={bookDetails?.cover} />
              </div>
              <div className='flex flex-col max-md:items-center gap-6 md:w-[50%] max-md:w-[90%] '>
                <div className='flex flex-col gap-2 items-start justify-start'>
                  <div className='flex items-center justify-center gap-4'>
                    <h3 className='text-3xl text-white font-bold flex max-md:flex-col md:hidden items-center justify-center text-center gap-2' >{bookDetails?.name.slice(0,15)}{bookDetails?.name && bookDetails?.name?.length > 15 && "..."}</h3>
                    <h3 className='text-3xl text-white font-bold flex max-md:flex-col max-md:hidden items-center gap-2' >{bookDetails?.name }</h3>

                    <button disabled={readListed} onClick={()=>{readlist(bookDetails?._id as string)}} className='bg-black h-10 w-10 flex hover:-translate-y-1 duration-200 items-center justify-center rounded-lg'>
                      {!readListed ? <Icon name='addread' className='w-5 pl-1 mt-1' color='white'/>: <MdLibraryAddCheck className='text-green-500'/>}
                    </button>
            
                  </div>
                  <button onClick={()=>{setIsLoading(true);router.push("/authors/"+userDetails?.wallet)}} className=' text-sm flex text-semibold gap-2 text-white'>Belongs to: <span className='font-bold flex items-center justify-center gap-1'>{userDetails?.collectionName}<FaBookOpen/></span></button>
                </div>
                <p className='text-sm text-white' >{bookDetails?.description?.substring(0,200)}</p>
                <div className='flex flex-wrap gap-2'>
                  {bookDetails?.tags?.map((item)=>(
                    <div className='min-w-20 px-2 py-2 bg-white/10 flex items-center justify-center text-white text-sm font-semibold border-[1px] border-white rounded-lg'>
                      {item}
                    </div>
                  ))}
                </div>
                <div className='flex gap-2'>
                    <button className='w-32 h-10 py-1 px-3 flex items-center justify-center rounded-lg text-white font-bold hover:-translate-y-1 duration-200 bg-black' onClick={()=>{setLocalStorage()}}>Read</button>
                    {/* @ts-ignore */}
                    <button disabled={bookDetails?.maxMint > 0 && bookDetails?.maxMint == bookDetails?.minted} onClick={()=>{setShowModal(true)}} className='text-black bg-gray-200 h-10 w-32 font-bold rounded-lg hover:-translate-y-1 px-3 py-1 transform transition duration-200 ease-in-out flex items-center justify-center flex-col gap-0'>{bookDetails?.maxMint > 0 && bookDetails?.minted < bookDetails?.maxMint && "Mint"} {bookDetails?.maxMint > 0 && bookDetails?.minted >= bookDetails?.maxMint && "Minted Out!"} {bookDetails?.maxMint == 0 && "Collect"}</button>
                    {bookDetails && bookDetails?.minted as number > 0 && <a target='_blank' className='w-10 h-10 py-1 px-2 flex items-center justify-center text-xl rounded-lg font-bold hover:-translate-y-1 duration-200 bg-[#2181e3] text-white' href={`https://opensea.io/assets/base/${bookDetails.contractAddress}/${bookDetails.tokenId}`} ><SiOpensea/></a>}
                </div>
              </div>
            </div>
        </div>
        
        <div className='px-5 mt-5'>
          <h2 className='text-2xl font-bold'>Holders</h2>
          <div className='h-40 w-full mt-5 bg-nifty-gray-1/40 rounded-xl flex items-center justify-center text-nifty-gray-2 font-bold'>No Holders Yet</div>
        </div>

        <RecommendedFetcher/>
    </div>
      </>
  )
}
