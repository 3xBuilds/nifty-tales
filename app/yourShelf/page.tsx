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
import OptionToggle from "@/components/Global/OptionToggle";
import Book from "@/components/Global/Book";

export default function Home(){

    const {user, getUser} = useGlobalContext();

    const[toggle, setToggle] = useState<string>("Readlist");

    const {data:session} = useSession()

    const[readList, setReadList] = useState<Array<Array<BookType>>>([])
    const[slicer, setSlicer] = useState<number>(4);

    const[mintList, setMintList] = useState<Array<BookType>>()

    useEffect(()=>{
        if(user){

            var arr1:any= []
            var subArr1:any = []

            var arr2:any= []
            var subArr2:any = []


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

            user?.mintedBooks.reverse().map((item:any, i)=>{
                console.log(item);
                subArr2.push(item);
                
                if(subArr1.length == slicer || i == user.mintedBooks.length-1){
                    arr2.push(subArr2);
                    subArr2 = []
                }
            })

            //@ts-ignore
            // if(arr1[0].length > 0)
            setMintList(arr2);


        
    },[slicer, user])

    const router = useRouter()

    useEffect(()=>{
        const screenWidth = window.innerWidth;

        if(screenWidth > 1100){
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
        <div className="h-screen w-screen flex flex-col items-center justify-start md:px-16 pt-24 " >
            <div className="flex w-screen justify-end absolute">
               <Navbar/>
            </div>

            <div className="w-full px-5">
                <h3 className="text-3xl font-bold mb-2">Your Shelf</h3>
                <OptionToggle  options={["Readlist", "Minted"]} selectedOption={toggle} setOption={setToggle} />
                {readList.length > 0 && toggle == "Readlist" ? <div>
                    {readList.map((item:any)=>(
                        <div className="w-full mb-5 mt-10">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item?.map((item2:BookType)=>(<div className="flex relative group flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                            <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 max-md:translate-y-3 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-md:w-[110%] w-[80%] text-white rounded-b-xl to-black/50 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name}</h2>
                            </div>
                            <div className="absolute z-50 top-1  " >
                                <button onClick={()=>{deleteFromReadList(item2._id)}} className="bg-black text-white p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><IoMdTrash/></button>
                            </div>
                            <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                                <Book img={item2.cover} />
                            </button>
                        </div>
                        ))}
                        </div>
                            <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-black/20 relative z-10">
                            </div>
                        </div>
                    ))}
                </div>:<>
                
                {toggle == "Readlist" && <div className="w-full h-80 flex flex-col items-center justify-center">
                        <h3 className="text-xl font-semibold text-gray-500 mb-3">Your shelf seems empty :(</h3>
                        <h3 className="text-lg font-medium text-gray-400 mb-5 flex gap-2 items-center">Add some books from <button onClick={()=>{router.push("/explore")}} className="h-10 w-32 bg-gray-200 font-semibold hover:-translate-y-1 duration-200 text-black rounded-lg" >Explore</button></h3>
                        
                    </div>}
                </>
                }
                
                {/* @ts-ignore */}
                {mintList.length > 0 && toggle == "Minted" ? <div>
                    {mintList?.map((item:any)=>(
                        <div className="w-full mb-5 mt-10">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item?.map((item2:BookType)=>(<div className="flex relative group flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                            <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 max-md:translate-y-3 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-md:w-[110%] w-[80%] text-white rounded-b-xl to-black/50 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name}</h2>
                            </div>
                            <div className="absolute z-50 top-1  " >
                                <button onClick={()=>{deleteFromReadList(item2._id)}} className="bg-black text-white p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><IoMdTrash/></button>
                            </div>
                            <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                                <Book img={item2.cover} />
                            </button>
                        </div>
                        ))}
                        </div>
                            <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-black/20 relative z-10">
                            </div>
                        </div>
                    ))}
                </div>:
                    <>
                    {toggle == "Minted" && <div className="w-full h-80 flex flex-col items-center justify-center">
                        <h3 className="text-xl font-semibold text-gray-500 mb-3">Seems like you haven't minted anything</h3>
                        <h3 className="text-lg font-medium text-gray-400 mb-5 flex gap-2 items-center">Find an author to support <button onClick={()=>{router.push("/explore")}} className="h-10 w-32 bg-gray-200 font-semibold hover:-translate-y-1 duration-200 text-black rounded-lg" >Explore</button></h3>
                        
                    </div>}
                    </>
                }
            </div>
        </div>
    )
}