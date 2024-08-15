"use client"

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export const RecommendedFetcher = () => {

    const router = useRouter()
    const [publishedBooks, setPublishedBooks] = useState([])
    const[slicer, setSlicer] = useState(0);

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
  
        if(screenWidth > 1200){
            setSlicer(5);
        } else if(screenWidth <= 1200){
            setSlicer(4);
        }
      },[])
  
      useEffect(()=>{
        getAllBooks();
    },[slicer])

  return (
    <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
            <div className="w-full">
                    <h3 className="text-2xl font-bold ">Recommended</h3>
            </div>

            {publishedBooks.map((item:any)=>(
                <div className="w-full mb-5">
                <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                {item.map((item2:any)=>(<div className="flex flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                <h2 className="font-semibold text-sm" >{item2.name}</h2>

                    <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                        <div className="w-full h-52 overflow-hidden rounded-lg relative z-10">
                            <Image src={item2.cover} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="w-full h-full shadow-xl shadow-black/40 absolute top-1 left-1 bg-gray-200 rounded-lg z-[9]" >
                        </div>
                    </button>
                </div>
                ))}
                </div>
                    <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-black/20 relative z-10">
                    </div>
                </div>
            ))}


        </div>
  )
}
