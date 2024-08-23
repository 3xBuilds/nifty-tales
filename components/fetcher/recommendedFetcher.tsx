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

export const RecommendedFetcher = () => {

    const router = useRouter()
    const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])
    const [publishedBooks, setPublishedBooks] = useState([])
    const[slicer, setSlicer] = useState(0);

    const {user, getUser} = useGlobalContext()

    const {data:session} = useSession();

    const [readListed, setReadListed] = useState<Array<boolean>>([]);

    async function getAllBooks(){
        try{
          const books = await axios.get("/api/book/");
  
          var arr1:any= []
          var subArr1:any = []
  
          books.data.data.reverse().map((item:any, i:number)=>{
              if(item.isPublished && !item.isHidden){
                  subArr1.push(item);
              }
              if(subArr1.length == slicer || i == books.data.data.length-1){
                if(subArr1.length>0)
                  arr1.push(subArr1);
                  subArr1 = []
              }
          })
  
          //@ts-ignore
          setPublishedBooks(arr1);
  
        }
        catch(err){
          console.log(err);
        }
      }

    useEffect(()=>{
        const screenWidth = window.innerWidth;
  
        if(screenWidth > 1100){
            setSlicer(5);
        } else if(screenWidth <= 1100){
            setSlicer(4);
        }
      },[])


    useEffect(()=>{
      //@ts-ignore
      const arr = [];
      user?.readlist.map((item:any)=>{
        //@ts-ignore
        if(item._id == publishedBooks?._id){
          arr.push(true);
        }
        else{
          arr.push(false);
        }
      })
      //@ts-ignore
      setReadListed(arr);
    },[user, publishedBooks])
  
      useEffect(()=>{
        getAllBooks();
    },[slicer])

  return (
    <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
            <div className="w-full">
                    <h3 className="text-2xl font-bold mb-5">Recommended</h3>
            </div>

            {publishedBooks.map((item:any, i)=>(
                <div className="w-full mb-5">
                <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                {item.map((item2:any)=>(<div onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="flex cursor-pointer flex-col relative group items-center px-2 md:px-10 mt-2 justify-center gap-4">
                    <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 max-md:translate-y-3 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-md:w-[110%] w-[80%] text-white rounded-b-xl to-black/50 items-center justify-center"> 
                            <h2 className="font-semibold text-sm mt-5" >{item2.name.slice(0,12)}</h2>
                        </div>

                    <button className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:-translate-y-2 duration-200 justify-center " >
                        <Book img={item2.cover} />
                    </button>
                </div>
                ))}
                </div>
                <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-gray-300 relative z-10">
                </div>
                </div>
            ))}


        </div>
  )
}
