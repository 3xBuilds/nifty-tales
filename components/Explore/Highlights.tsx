"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Icon from '../Global/Icon';
import { openSans } from '@/utils/font';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import { useGlobalContext } from '@/context/MainContext';
import { MdLibraryAddCheck } from 'react-icons/md';
import { useLoading } from '../PageLoader/LoadingContext';


const Highlights = () => {

    const router = useRouter();

    const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])

    const {data:session} = useSession();
    const {user, getUser, userRaw} = useGlobalContext();


    const [highlights, setHighlights] = useState<Array<BookType>>([]);

    const fetchHighlights = async () => {
        try{
            await axios.get("/api/book").then(async(res)=>{

                const userNew = userRaw;

                var arr:any = []

                res.data.data.map((item:BookType)=>{
                    if(item.isPublished && !item.isHidden && !item.isAdminRemoved){
                        arr.push({item, readlisted: userNew?.readlist.includes(item._id)});
                    }
                })
                
                setHighlights(arr.reverse());


            });
        }
        catch(err){
            console.log(err);
        }
    }

    const readlist = async (id:string) => {
        try{
            await axios.post("/api/readlist", {email: session?.user?.email, bookId:id}).then((res)=>{
                toast.success("Added to Readlist!");
                getUser();
            });
        }
        catch(err:any){
            console.log(err);
            if(err.response.status == 501){
                toast.error(err.response.data.error);
              }
              else{
                toast.error("Error while adding to readlist. Try again!")
              }
        }
    }

    useEffect(() => {
        fetchHighlights();
    }, [user])

  return (
    <div className='w-full p-5'>
        <h2 className='font-bold text-2xl mb-4 ' >Latest Publishes</h2>
        <div className='w-full  flex-col flex items-start justify-start noscr'>
            <div className='grid grid-rows-1 md:h-[16.5rem] grid-flow-col gap-2'>
                {
                    highlights.length == 0 ? <div className='md:h-[16.5rem] flex gap-2'>
                            {[0,1,2,3,4].map((item)=>(
                                <div className='w-[450px] md:h-[16.5rem] max-md:w-[20rem] max-md:h-[25rem] p-8 bg-gray-200 flex flex-row animate-pulse items-center justify-start overflow-hidden relative rounded-xl'>
                                </div>
                            ))}
                        </div>:
                        <>
                        {highlights?.slice(0,5).map((highlight:any, i)=>(
                    <div className='md:w-[450px] max-md:w-[20rem] max-md:h-[28rem] p-8 bg-gray-200 flex flex-row max-md:flex-col items-center justify-start overflow-hidden relative rounded-xl'>
                        <div onClick={()=>{setIsLoading(true);router.push(`/books/${highlight.item._id}`)}} className="md:w-40 md:h-[16.5rem] max-md:w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center duration-200 justify-center " >
                            <div className="w-40 h-52 max-md:w-32 max-md:h-44 overflow-hidden rounded-lg relative z-30">
                                <Image src={highlight.item.cover as string} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="w-full h-[13rem] max-md:h-44 shadow-xl shadow-black/40 absolute max-md:top-1 md:top-8 left-1 bg-gray-200 rounded-lg z-[29]" >
                            </div>
                        </div>
                        <div className='w-fit relative z-20 pl-5 pt-5 text-white flex flex-col items-start justify-start h-full'>
                            <h2 className='text-2xl font-bold'>{highlight.item.name.slice(0,15)}{highlight.item.name.length>16 && "..."}</h2>
                            <p className={ openSans.className + ' text-xs font-normal mt-2'}>{highlight.item.description?.substring(0,50)}{highlight.item.description.length>51 && "..."}</p>
                        </div>
                        <div className='w-full h-full absolute top-0 left-0 z-10 bg-black/30 backdrop-blur'></div>
                        <div className='w-full h-full absolute top-0 left-0 z-0'>
                            <Image width={1080} height={1080} src={highlight.item.cover as string} alt="" className=' object-cover w-full h-full flex items-center justify-center'/>
                        </div>
                        <div className='flex flex-row gap-2 max-md:items-center max-md:justify-center md:absolute bottom-8 right-8 z-20'>
                            <button onClick={()=>{setIsLoading(true);router.push(`/books/${highlight.item._id}`)}} className='text-nifty-black text-sm font-semibold bg-white hover:bg-nifty-white rounded-lg max-md:w-36 px-4 py-1 md:px-4 md:py-1'>View</button>
                            <button disabled={highlight.readlisted} onClick={()=>{readlist(highlight.item._id)}} className='text-nifty-black text-sm font-semibold bg-nifty-black rounded-lg w-8 h-8 flex items-center justify-center'>
                                    {!highlight.readlisted ? <Icon name='addread' className='w-5 pl-1 mt-1' color='white'/>: <MdLibraryAddCheck className='text-green-500'/>}
                            </button>
                        </div>
                    </div>))}
                        </>
                    
                }
            </div>
        </div>
    </div>
  )
}

export default Highlights