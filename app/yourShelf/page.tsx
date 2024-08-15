"use client"

import Navbar from "@/components/Home/Navbar";
import { useGlobalContext } from "@/context/MainContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoTrashBin } from "react-icons/io5";
import Image from "next/image";
import { IoMdTrash } from "react-icons/io";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Home(){

    const {user, getUser} = useGlobalContext();

    const {data:session} = useSession()

    const[readList, setReadList] = useState<Array<Array<BookType>>>([])
    const[slicer, setSlicer] = useState<number>(4);

    useEffect(()=>{
        if(user){

            var arr1:any= []
            var subArr1:any = []

            user.readlist.reverse().map((item:any, i)=>{
                console.log(item);
                subArr1.push(item);
                
                if(subArr1.length == slicer || i == user.readlist.length-1){
                    arr1.push(subArr1);
                    subArr1 = []
                }
            })

            //@ts-ignore
            // if(arr1[0].length > 0)
            setReadList(arr1);


        }
    },[slicer, user])

    const router = useRouter()

    useEffect(()=>{
        const screenWidth = window.innerWidth;

        if(screenWidth > 1200){
            setSlicer(5);
        }

    },[])

    async function deleteFromReadList(id:string){
        try{
            await axios.delete("/api/readlist", {data:{email: session?.user?.email, bookId: id}}).then((res)=>{
                console.log(res.data.book, res.data.user);
                getUser()
            })
        }
        catch(err){
            console.log(err);
        }
    }

    return(
        <div className="h-screen w-screen flex flex-col items-center justify-start md:px-16 pt-24" >
            <div className="flex w-screen justify-end absolute">
               <Navbar/>
            </div>

            <div className="w-full">
                <h3 className="text-3xl font-bold mb-10">Your Shelf</h3>
                <div>
                    {readList.map((item:any)=>(
                        <div className="w-full mb-5">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item?.map((item2:BookType)=>(<div className="flex relative group flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                            <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 w-[90%] text-white rounded-b-xl to-black/70 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name}</h2>
                            </div>
                            <div className="absolute z-50 top-1  right-8" >
                                <button onClick={()=>{deleteFromReadList(item2._id)}} className="bg-white text-black p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><IoMdTrash/></button>
                            </div>
                            <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                                <div className="w-full h-52 overflow-hidden rounded-lg relative z-10">
                                    <Image src={item2.cover as string} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
        </div>
    )
}