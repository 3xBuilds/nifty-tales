"use client"

import { usePathname, useRouter } from 'next/navigation'
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
    const pathname = usePathname();

  useEffect(()=>{
    setIsLoading(false)
  },[])
    
    const {recentBooks, publishedBooks, boosted} = useGlobalContext();
    const {night} = useGlobalContext();
    const [type, setType] = useState('Trending');


  return (
    <div className='lg:px-5 px-4 flex gap-4 mt-8 flex-col items-start justify-center w-full pb-20'>

      <div className="flex flex-col items-start justify-center w-full">


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
                  <div className="w-full max-lg:flex max-lg:flex-wrap max-lg:gap-6 items-center max-sm:justify-center sm:justify-start lg:gap-2 flex flex-wrap gap-1 " >
                  {item.map((item2:any)=>(
                    <div onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="flex cursor-pointer relative group items-start p-4 mt-2 justify-start gap-4 w-80 dark:hover:bg-white dark:hover:text-black dark:text-white dark:bg-white/10 bg-nifty-gray-1/10 text-black hover:bg-black hover:text-white duration-200 border-white rounded-xl ">
                     
                      <button className="w-fit h-fit flex flex-col cursor-pointer relative items-center hover:-translate-y-2 duration-200 justify-center " >
                          <Book height={32} width={24} img={item2.cover} />
                      </button>

                      <div className='flex flex-col h-full justify-start gap-2'>
                        <h2 className='text-sm font-bold'>{item2.name}</h2>
                        <h2 className='text-xs'>{item2.description.slice(0,50)}{item2.description.length > 50 && "..."}</h2>
                      </div>
                  </div>
                  ))}
                  </div>
                  {/* <div className={`w-full h-5 max-lg:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b duration-200 dark:from-[#313131] dark:to-[#232323] from-white to-gray-300 relative z-10`}>
                  </div> */}
                  </div>
              ))}
            </>}

            {type == "Latest" && <>
              {publishedBooks && publishedBooks.slice(0,11).map((item:any, i)=>(
                  <div className="w-full mb-5">
                  <div className="w-full max-lg:flex max-lg:flex-wrap max-lg:gap-6 items-center max-sm:justify-center sm:justify-start lg:gap-2 flex flex-wrap gap-1 " >
                  {item.map((item2:any)=>(
                    <div onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="flex cursor-pointer relative group items-start p-4 mt-2 justify-start gap-4 w-80 dark:hover:bg-white dark:hover:text-black dark:text-white dark:bg-white/10 bg-nifty-gray-1/10 text-black hover:bg-black hover:text-white duration-200 border-white rounded-xl ">
                     
                      <button className="w-fit h-fit flex flex-col cursor-pointer relative items-center hover:-translate-y-2 duration-200 justify-center " >
                          <Book height={32} width={24} img={item2.cover} />
                      </button>

                      <div className='flex flex-col h-full justify-start gap-2'>
                        <h2 className='text-sm font-bold'>{item2.name}</h2>
                        <h2 className='text-xs'>{item2.description.slice(0,50)}{item2.description.length > 50 && "..."}</h2>
                      </div>
                  </div>
                  ))}
                  </div>
                  {/* <div className={`w-full h-5 max-lg:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b duration-200 dark:from-[#313131] dark:to-[#232323] from-white to-gray-300 relative z-10`}>
                  </div> */}
                  </div>
              ))}
            </>}


      </div>

    
    </div>
  )
}


