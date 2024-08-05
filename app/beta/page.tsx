"use client"

import { useRouter } from "next/navigation"

export default function Home(){

    const router = useRouter();

    return(
        <div className="flex flex-col items-center justify-start w-screen min-h-screen p-10">
          <button onClick={()=>{router.push("/beta/makeAuthor")}} className='bg-[#171717] rounded-lg text-[#eeeeee] h-10 font-semibold px-5 w-52 my-4 max-md:mx-auto'>Become an Author</button>
        </div>
    )
}