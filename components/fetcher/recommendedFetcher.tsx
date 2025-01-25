"use client"

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Book from '../Global/Book'
import Icon from '../Global/Icon'
import { toast } from 'react-toastify'
import { useGlobalContext } from '@/context/MainContext'
import { useSession } from 'next-auth/react'
import { MdLibraryAddCheck } from 'react-icons/md'
import { useLoading } from '../PageLoader/LoadingContext'
import OptionToggle from '../Global/OptionToggle'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Link from 'next/link'

import moment from 'moment';

export const RecommendedFetcher = () => {

    const router = useRouter()
    const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])
    
    const {recentBooks, publishedBooks, boosted} = useGlobalContext();
    const {night} = useGlobalContext();
    const [type, setType] = useState('Trending');

    const[page, setPage] = useState(1);

    const[txnData, setTxnData] = useState([]);

    async function fetchTxns(page:number){
      try{
        const res = await axios.get("/api/transaction/get?page="+1);
        console.log(res.data.txns)
        setTxnData(res.data.txns)
      }
      catch(err){
        toast.error("Failed to fetch transactions")
      }
    }


    useEffect(()=>{
      setInterval(()=>{
        fetchTxns(page)
      }, 5000)
    },[page])

  return (
    <div className='lg:px-5 px-4 lg:flex gap-4 mt-8 max-lg:flex-col items-start justify-center w-full max-lg:pb-20'>

      <div className="flex flex-col items-start justify-center lg:w-[50%]">


              {boosted && boosted?.length > 0 && <div className='mb-16 w-full'>
                <div className="w-full my-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-b from-yellow-700 via-yellow-400 to-yellow-600 text-transparent bg-clip-text"><span className='text-black'>Nifty</span> Picks ✨</h3>
                </div>
                {boosted.slice(0,11).map((item:any, i)=>(
                  <div className="w-full mb-5">
                  <div className="w-full max-lg:flex max-lg:flex-wrap max-lg:gap-6 items-center max-sm:justify-center sm:justify-start lg:gap-2 lg:grid lg:grid-flow-col min-[1100px]:grid-cols-5 lg:grid-cols-4 " >
                  {item.map((item2:any)=>(<div onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="flex cursor-pointer flex-col relative group items-center px-2 lg:px-10 mt-2 justify-center gap-4">
                      <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 max-lg:translate-y-3 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-lg:w-[110%] w-[80%] text-white rounded-b-xl to-black/50 items-center justify-center"> 
                              <h2 className="font-semibold text-sm mt-5" >{item2.name.slice(0,12)}{item2.name.length>12 && "..."}</h2>
                          </div>

                      <button className="lg:w-40 lg:h-68 w-32 max-lg:h-44 flex flex-col cursor-pointer relative items-center hover:-translate-y-2 duration-200 justify-center " >
                          <Book img={item2.cover} />
                      </button>
                  </div>
                  ))}
                  </div>
                  <div className="w-full h-5 max-lg:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-gray-300 relative z-10">
                  </div>
                  </div>
              ))}
              </div>}

              <div className="w-full">
                    <h3 className="text-2xl font-bold">Library</h3>
              </div>
              
              <div className='mb-5'>
                <OptionToggle options={['Trending', 'Latest']} selectedOption={type} setOption={setType} />
              </div>

            {type == "Trending" && <>
              {recentBooks && recentBooks.slice(0,11).map((item:any, i)=>(
                  <div className="w-full mb-5">
                  <div className="w-full max-lg:flex max-lg:flex-wrap max-lg:gap-6 items-center max-sm:justify-center sm:justify-start lg:gap-2 lg:grid lg:grid-flow-col min-[1100px]:grid-cols-5 lg:grid-cols-4 " >
                  {item.map((item2:any)=>(<div onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="flex cursor-pointer flex-col relative group items-center px-2 lg:px-10 mt-2 justify-center gap-4">
                      <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 max-lg:translate-y-3 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-lg:w-[110%] w-[80%] text-white rounded-b-xl to-black/50 items-center justify-center"> 
                              <h2 className="font-semibold text-sm mt-5" >{item2.name.slice(0,12)}{item2.name.length>12 && "..."}</h2>
                          </div>

                      <button className="lg:w-40 lg:h-68 w-32 max-lg:h-44 flex flex-col cursor-pointer relative items-center hover:-translate-y-2 duration-200 justify-center " >
                          <Book img={item2.cover} />
                      </button>
                  </div>
                  ))}
                  </div>
                  <div className={`w-full h-5 max-lg:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b duration-200 ${night ? "from-[#313131] to-[#232323]" : "from-white to-gray-300"} relative z-10`}>
                  </div>
                  </div>
              ))}
            </>}

            {type == "Latest" && <>
              {publishedBooks && publishedBooks.slice(0,11).map((item:any, i)=>(
                  <div className="w-full mb-5">
                  <div className="w-full max-lg:flex max-lg:flex-wrap max-lg:gap-6 items-center max-sm:justify-center sm:justify-start lg:gap-2 lg:grid lg:grid-flow-col min-[1100px]:grid-cols-5 lg:grid-cols-4 " >
                  {item.map((item2:any)=>(<div onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="flex cursor-pointer flex-col relative group items-center px-2 lg:px-10 mt-2 justify-center gap-4">
                      <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 max-lg:translate-y-3 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-lg:w-[110%] w-[80%] text-white rounded-b-xl to-black/50 items-center justify-center"> 
                              <h2 className="font-semibold text-sm mt-5" >{item2.name.slice(0,12)}{item2.name.length>12 && "..."}</h2>
                          </div>

                      <button className="lg:w-40 lg:h-68 w-32 max-lg:h-44 flex flex-col cursor-pointer relative items-center hover:-translate-y-2 duration-200 justify-center " >
                          <Book img={item2.cover} />
                      </button>
                  </div>
                  ))}
                  </div>
                  <div className={`w-full h-5 max-lg:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b duration-200 ${night ? "from-[#313131] to-[#232323]" : "from-white to-gray-300"} relative z-10`}>
                  </div>
                  </div>
              ))}
            </>}


      </div>

      <div className='lg:w-[50%] max-lg:mt-10'>
        <div className="w-full">
              <h3 className="text-2xl font-bold">Latest Mints</h3>
        </div>

        <div className="w-full h-full">
          <div className='border-[1px] rounded-t-lg border-gray-300 bg-nifty-gray-1/20 flex py-2'>
              <div className='w-[25%] font-bold text-center'>By</div>
              <div className='w-[25%] font-bold text-center'>Book</div>
              <div className='w-[25%] font-bold text-center'>Txn</div>
              <div className='w-[25%] font-bold text-center'>Time</div>
          </div>
          <div>
              {txnData && txnData.map((item:any, i)=>(
                <div key={i} className={`border-x-[1px] border-b-[1px] ${i==9 && "rounded-b-lg"} border-gray-300 flex py-2 ${night ? "text-nifty-gray-1" : "text-black"}`}>
                    <div className='w-[25%] flex items-center justify-center gap-2 text-xs'>{item.user.profileImage !== "" ? <Image width={540} height={540} src={item.user.profileImage} alt='user' className='w-8 h-8 rounded-full' /> : <div className='w-8 h-8 rounded-full bg-nifty-gray-1/20'></div>}<h2 className='w-20 truncate'>{item.user.username}</h2></div>
                    <Link href={`/books/${item.book._id}`} className='w-[25%] text-center my-auto text-xs font-bold'>{item.book.name.substring(0,15)}{item.book.name.length > 15 && "..."}</Link>
                    <Link href={`https://basescan.org/tx/${item.txnHash}`} className='w-[25%] text-center mx-auto text-xs text-black font-semibold flex justify-center items-center gap-2'>Basescan <FaExternalLinkAlt/></Link>
                    <div className='w-[25%] text-center text-xs my-auto'>{moment(item.createdAt).fromNow()}</div>
                </div>
              ))}
          </div>


        </div>

      </div>
    </div>
  )
}
