"use client"
import React, { useEffect, useState } from 'react'
import { book1, book2, book3, book4, book5 } from '@/assets/assets';
import Image from 'next/image';
import Icon from '../Global/Icon';
import { openSans } from '@/utils/font';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react'


const Highlights = () => {

    const router = useRouter();

    const {data:session} = useSession();


    const [highlights, setHighlights] = useState<Array<BookType>>([]);

    const fetchHighlights = async () => {
        try{
            await axios.get("/api/book").then((res)=>{
                console.log(res.data.data)
                setHighlights(res.data.data);
            })
        }
        catch(err){
            console.log(err);
        }
    }

    const readlist = async (id:string) => {
        try{
            await axios.post("/api/readlist", {email: session?.user?.email, bookId:id}).then((res)=>{
                console.log(res.data.user, res.data.book);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        fetchHighlights();
    }, [])

  return (
    <div className='w-full p-5 flex-col flex items-start justify-start noscr'>
        <h2 className='font-bold text-2xl mb-4' >Latest Publishes</h2>
        <div className='grid grid-rows-1 grid-flow-col gap-2'>
            {highlights?.reverse().slice(0,5).map((highlight:BookType, index)=>(
                <div className='w-[450px] p-8 bg-gray-200 flex flex-row items-center justify-start overflow-hidden relative rounded-xl'>
                    <div onClick={()=>{router.push(`/books/${highlight._id}`)}} className="md:w-40 md:h-68 max-md:w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center duration-200 justify-center " >
                        <div className="w-40 h-52 max-md:w-32 max-md:h-44 overflow-hidden rounded-lg relative z-30">
                            <Image src={highlight.cover as string} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="w-full h-full shadow-xl shadow-black/40 absolute top-1 left-1 bg-gray-200 rounded-lg z-[29]" >
                        </div>
                    </div>
                    <div className='w-fit relative z-20 pl-5 pt-5 text-white flex flex-col items-start justify-start h-full'>
                        <h1 className='text-2xl font-bold'>{highlight.name}</h1>
                        <p className={ openSans.className + ' text-xs font-normal mt-2'}>{highlight.description?.substring(0,100)}...</p>
                    </div>
                    <div className='w-full h-full absolute top-0 left-0 z-10 bg-black/30 backdrop-blur'></div>
                    <div className='w-full h-full absolute top-0 left-0 z-0'>
                        <Image width={1080} height={1080} src={highlight.cover as string} alt="" className=' object-cover w-full flex items-center justify-center'/>
                    </div>
                    <div className='flex flex-row gap-2 absolute bottom-8 right-8 z-20'>
                        <button onClick={()=>{router.push(`/books/${highlight._id}`)}} className='text-nifty-black text-sm font-semibold bg-white hover:bg-nifty-white rounded-lg px-4 py-1'>View</button>
                        <button onClick={()=>{readlist(highlight._id)}} className='text-nifty-black text-sm font-semibold bg-nifty-black rounded-lg w-8 h-8 flex items-center justify-center'>
                            <Icon name='addread' className='w-5 pl-1 mt-1' color='white'/>
                        </button>
                    </div>
                </div>))}
        </div>
    </div>
  )
}

export default Highlights