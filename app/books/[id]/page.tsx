"use client"

import { usePathname } from 'next/navigation'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Home/Navbar';
import { useRouter } from 'next/navigation';

type BookType = {
  name: string;
  isPublished?: boolean;
  price?: number;
  maxMint?: number;
  cover?: string | null;
  author: Object | null;
  artist?: string | null;
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

    const [publishedBooks, setPublishedBooks] = useState([])
    const[slicer, setSlicer] = useState(4);

    const router = useRouter()

    async function getBookDetails(){
      try{
        await axios.get("/api/book/"+pathname.split("/")[2]).then((res)=>{
          setBookDetails(res.data.data);
        });
      }
      catch(err){
        console.log(err);
      }
    }

    async function getAllBooks(){
      try{
        const books = await axios.get("/api/book/");

        var arr1:any= []
        var subArr1:any = []
        var arr2:any = []
        var subArr2:any = []


        books.data.data.reverse().map((item:any, i:number)=>{
            if(item.isPublished){
                subArr1.push(item);
            }
            if(subArr1.length == slicer || i == books.data.data.length-1){
                arr1.push(subArr1);
                subArr1 = []
            }
            if(!item.isPublished){
                subArr2.push(item);
            }
            if(subArr2.length == slicer || i == books.data.data.length-1){
                arr2.push(subArr2);
                subArr2 = []
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
      getBookDetails();
      getAllBooks();
      const screenWidth = window.innerWidth;

      if(screenWidth > 1200){
          setSlicer(5);
      }
    },[])

    useEffect(()=>{
      

  },[])

    return (
    <div className=''>
        <div className="h-16 w-screen relative z-[100000]">
            <Navbar/>
        </div>
        <div className="w-screen relative h-[10rem] md:h-[22rem] max-md:flex items-center justify-center overflow-hidden object-fill ">
            <div className="w-screen absolute h-full overflow-hidden">
                <Image width={1080} height={1080} src={bookDetails?.cover || ""} alt="dp" className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 brightness-50 -translate-y-1/2"/>
            </div>
            <div className="flex gap-8 object-center items-center h-full justify-center my-auto max-md:w-[90%] absolute z-50  md:left-10">
                <Image width={1080} height={1080} src={bookDetails?.cover || ""} alt="dp" className="md:w-[10rem] md:h-[10rem] h-[6rem] w-[6rem] border-4 border-white rounded-full" />
                <h2 className="md:text-5xl text-xl font-bold text-white">{bookDetails?.name}</h2>
            </div>
        </div>

        <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
            <div className="w-full">
                    <h3 className="text-2xl font-bold ">Recommended</h3>
            </div>

            {publishedBooks.map((item:any)=>(
                <div className="w-full mb-5">
                <div className="w-full max-md:flex max-md:flex-col max-md:gap-6 md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                {item.map((item2:any)=>(<div className="flex flex-col items-center px-10 mt-2 justify-center gap-4">
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
    </div>
  )
}